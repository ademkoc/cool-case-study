import fastifySwagger from "@fastify/swagger";

export default fastifySwagger;
export const autoConfig = {
    mode: "dynamic",
    openapi: {
        info: {
            title: "String",
            description: "String",
            version: "String"
        }
    }
};
