import fastifySwaggerUi from "@fastify/swagger-ui";

export default fastifySwaggerUi;
export const autoConfig = {
    routePrefix: "/docs",
    prefix: "/docs"
};
