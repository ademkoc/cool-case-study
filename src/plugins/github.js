import fp from "fastify-plugin";
import {factoryGithubDomain} from "../domain/github-domain.js";

/**
 * This plugin will not be activated in autoload.
 * Only registered in github route plugin.
 * @param {*} fastify
 */
async function Github(fastify) {
    fastify.decorate(
        "github",
        factoryGithubDomain({
            apiKey: fastify.env.GITHUB_API_KEY
        })
    );
}

export default fp(Github, {name: "github"});

export const autoload = false;
