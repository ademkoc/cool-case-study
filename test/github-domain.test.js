import "dotenv/config";
import {describe, expect, it, test, expectTypeOf} from "vitest";
import {factoryGithubDomain} from "../src/domain/github-domain.js";

const options = {
    apiKey: process.env.GITHUB_API_KEY
};

describe("Github API", () => {
    test("GITHUB_API_KEY must be provided", () => {
        expect(options.apiKey).is.not.undefined;
    });

    test("GITHUB connection", async () => {
        const github = factoryGithubDomain(options);
        await expect(github.githubClient.get()).resolves.toContain({statusCode: 200});
    });

    it("should return organization repositories", async () => {
        const github = factoryGithubDomain(options);

        const response = await github.getOrganizationRepositories("nodejs");

        expectTypeOf(response).toBeArray();
        const repository = response.at(0);

        expect(repository.owner.login).toBe("nodejs");
    });

    it("should return user repositories", async () => {
        const github = factoryGithubDomain(options);

        const response = await github.getUserRepositories("mcollina");

        expectTypeOf(response).toBeArray();
        const repository = response.at(0);

        expect(repository.owner.login).toBe("mcollina");
    });

    it("should return repository languages with url options", async () => {
        const github = factoryGithubDomain(options);

        const languages = await github.getRepositoryLanguages({
            url: "https://api.github.com/repos/nodejs/node/languages"
        });

        expectTypeOf(languages).toBeObject();

        expect(languages).toHaveProperty("C++");
    });

    it("should return repository languages with owner and repo options", async () => {
        const github = factoryGithubDomain(options);

        const languages = await github.getRepositoryLanguages({
            owner: "mcollina",
            repo: "desm"
        });

        expectTypeOf(languages).toBeObject();

        expect(languages).toHaveProperty("JavaScript");
    });

    it("should group languages by given repo language array", async () => {
        const github = factoryGithubDomain(options);

        const languageUrlArray = [
            "https://api.github.com/repos/nodejs/node/languages",
            "https://api.github.com/repos/denoland/deno/languages"
        ];

        const languages = await github.getBatchRepositoryLanguages(languageUrlArray);

        expect(languages).toHaveProperty("totalByte");
        expect(languages).toHaveProperty("languages");
    });
});
