import fastifySwagger from "@fastify/swagger";

export default fastifySwagger;
export const autoConfig = {
    mode: "dynamic",
    openapi: {
        info: {
            title: "Github User-Organization Comparator API",
            description: "",
            version: "1.0.0"
        }
    }
};
