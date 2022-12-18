import got from "got";
import _ from "lodash";
import BigNumber from "bignumber.js";

const API_URL_PREFIX = "https://api.github.com/";
const DEFAULT_SEARCH_PARAM_PAGE = 1;
const DEFAULT_SEARCH_PARAM_PER_PAGE = 30;

class GithubDomain {
    constructor(options) {
        this.githubClient = got.extend({
            prefixUrl: API_URL_PREFIX,
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${options.apiKey}`,
                "X-GitHub-Api-Version": "2022-11-28"
            },
            responseType: "json"
        });
    }

    async getOrganizationRepositories(organizationName, options) {
        const page = options?.page || DEFAULT_SEARCH_PARAM_PAGE;
        const per_page = options?.per_page || DEFAULT_SEARCH_PARAM_PER_PAGE;

        const searchParams = new URLSearchParams([
            ["per_page", per_page],
            ["page", page]
        ]);

        const response = await this.githubClient.get(`orgs/${organizationName}/repos`, {
            searchParams
        });

        return response.body;
    }

    async getUserRepositories(username, options) {
        const page = options?.page || DEFAULT_SEARCH_PARAM_PAGE;
        const per_page = options?.per_page || DEFAULT_SEARCH_PARAM_PER_PAGE;

        const searchParams = new URLSearchParams([
            ["per_page", per_page],
            ["page", page]
        ]);

        const response = await this.githubClient.get(`users/${username}/repos`, {searchParams});

        return response.body;
    }

    async getRepositoryLanguages(options) {
        if (!options.url) {
            options.url = `${API_URL_PREFIX}repos/${options.owner}/${options.repo}/languages`;
        }

        const response = await this.githubClient.get(options.url, {
            prefixUrl: "",
            responseType: "json"
        });

        return response.body;
    }

    async getBatchRepositoryLanguages(repoLanguageUrlArray) {
        const languageResponseArray = [];
        const chunckArray = _.chunk(repoLanguageUrlArray, 10);

        for (const chunck of chunckArray) {
            const languages = await Promise.all(chunck.map((url) => this.getRepositoryLanguages({url})));
            languageResponseArray.push(...languages);
        }

        // group by language and sum total byte
        const result = languageResponseArray.reduce(
            (acc, repoLanguages) => {
                Object.keys(repoLanguages).forEach((languageName) => {
                    // increase total byte
                    acc.totalByte = acc.totalByte.plus(repoLanguages[languageName]);

                    // upsert language
                    const item = acc.languages.find(({name}) => name === languageName);
                    if (item) {
                        item.size = item.size.plus(repoLanguages[languageName]);
                    } else {
                        acc.languages.push({name: languageName, size: new BigNumber(repoLanguages[languageName])});
                    }
                });
                return acc;
            },
            {totalByte: new BigNumber(0), languages: []}
        );

        // sort stats by desc
        const sortedStats = result.languages.sort((a, b) => {
            if (a.size.isGreaterThan(b.size)) {
                return -1;
            } else if (a.size.isLessThan(b.size)) {
                return 1;
            } else {
                return 0;
            }
        });

        return {totalByte: result.totalByte, languages: sortedStats};
    }

    calculateLanguagesRatio(languages, totalByte, options = {}) {
        if (!Array.isArray(languages)) {
            throw new Error("'languages' must be an array");
        }

        if (!options.topN) {
            options.topN = 5;
        }

        const slicedLanguages = languages.slice(0, options.topN);

        const languagesRatios = slicedLanguages.map((language) => ({
            language: language.name,
            size: language.size.toString(),
            ratio: language.size.div(totalByte).times(100).dp(2).toNumber(),
            ownerTotal: totalByte.toString()
        }));

        return languagesRatios;
    }

    compareLanguageStack(user, organization) {
        const commonStats = _.intersectionBy(user, organization, "language");

        const result = commonStats.map((stats) => {
            const userLanguage = user.find(({language}) => language === stats.language);
            const orgLanguage = organization.find(({language}) => language === stats.language);

            const combineLanguageSize = new BigNumber(userLanguage.size).plus(orgLanguage.size);

            // totalByte değeri user/organization a göre hesaplandığı için dillere göre değişmeyecektir
            const totalByte = new BigNumber(userLanguage.ownerTotal).plus(orgLanguage.ownerTotal);

            const ratio = combineLanguageSize.div(totalByte).times(100).dp(2).toNumber();
            return {language: stats.language, ratio};
        });

        return result;
    }
}

function factoryGithubDomain(options) {
    return new GithubDomain(options);
}

export {GithubDomain, factoryGithubDomain};
