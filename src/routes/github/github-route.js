import Github from "../../plugins/github.js";

export const autoPrefix = "/v1";

const schemaCalculateCompability = {
    query: {
        type: "object",
        required: ["org", "user"],
        properties: {
            org: {type: "string"},
            user: {type: "string"}
        }
    }
};

const schemaBestMatches = {
    query: {
        type: "object",
        required: ["lang"],
        properties: {
            lang: {type: "string"}
        }
    }
};

export default function (app, options, done) {
    app.register(Github);

    app.route({
        method: "GET",
        url: "/calculate-compability",
        schema: schemaCalculateCompability,
        handler: async function (request, reply) {
            const {user, org} = request.query;

            const orgRepos = await app.github.getOrganizationRepositories(org);
            const userRepos = await app.github.getUserRepositories(user);

            const orgLanguageUrlArray = orgRepos.map((repo) => repo.languages_url);
            const userLanguageUrlArray = userRepos.map((repo) => repo.languages_url);

            const orgLanguages = await app.github.getBatchRepositoryLanguages(orgLanguageUrlArray);
            const userLanguages = await app.github.getBatchRepositoryLanguages(userLanguageUrlArray);

            const orgLanguageStats = app.github.calculateLanguagesRatio(orgLanguages.languages, orgLanguages.totalByte);
            const userLanguageStats = app.github.calculateLanguagesRatio(
                userLanguages.languages,
                userLanguages.totalByte
            );

            const compareResults = app.github.compareLanguageStack(userLanguageStats, orgLanguageStats);

            const Results = await app.mongo.client.db().collection("results");

            await Promise.all(
                compareResults.map((result) =>
                    Results.insertOne({
                        user,
                        org,
                        user_stats: userLanguageStats,
                        org_stats: orgLanguageStats,
                        language: result.language.toLowerCase(),
                        language_pretty: result.language,
                        ratio: result.ratio,
                        created_at: Date.now(),
                        updated_at: Date.now()
                    })
                )
            );

            reply.send(compareResults);
        }
    });

    app.route({
        method: "GET",
        url: "/best-matches",
        description: "post some data",
        schema: schemaBestMatches,
        handler: async function (request, reply) {
            const {lang} = request.query;

            const Results = await app.mongo.client.db().collection("results");

            const data = await Results.find({language: lang.toLowerCase()}, {}).sort({ratio: -1}).toArray();

            return reply.send(data);
        }
    });

    done();
}
