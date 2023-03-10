import {join} from "desm";
import fastify from "fastify";
import autoload from "@fastify/autoload";

export async function createServer(opts) {
    const server = fastify(opts);

    server.decorate("env", opts.env);

    await server.register(autoload, {
        dir: join(import.meta.url, "plugins"),
        dirNameRoutePrefix: false
    });

    await server.register(autoload, {
        dir: join(import.meta.url, "routes"),
        dirNameRoutePrefix: false
    });

    return server;
}

export async function startServer(opts) {
    const server = await createServer({
        logger: {
            level: "info"
        },
        disableRequestLogging: opts.env.ENABLE_REQUEST_LOGGING !== "true",
        env: opts.env
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
