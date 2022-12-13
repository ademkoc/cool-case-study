export default function (app, options, done) {
    app.route({
        method: "GET",
        url: "/",
        schema: {
            query: {
                type: "object",
                properties: {
                    org: {type: "string"},
                    user: {type: "string"}
                }
            }
        },
        handler: function (request, reply) {
            reply.send("calculate-compa");
        }
    });

    done();
}
