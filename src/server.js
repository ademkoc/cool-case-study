import {join} from "desm";
import fastify from "fastify";
import autoload from "@fastify/autoload";

export async function createServer(opts = {}) {
    const server = fastify(opts);

    await server.register(autoload, {
        dir: join(import.meta.url, "plugins"),
        dirNameRoutePrefix: false
    });

    await server.register(autoload, {
        dir: join(import.meta.url, "routes")
    });

    return server;
}

export async function startServer(opts = {}) {
    const server = await createServer({
        logger: {
            level: "info"
        },
        disableRequestLogging: opts.env.ENABLE_REQUEST_LOGGING !== "true"
    });

    try {
        await server.listen({
            host: opts.env.HOST,
            port: opts.env.PORT
        });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}
