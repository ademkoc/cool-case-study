import fastifyMongo from "@fastify/mongodb";

export const autoConfig = {url: process.env.MONGODB_CONNECTION_STRING};

export default fastifyMongo;
