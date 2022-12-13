export default function (app, options, done) {
    app.route({
        method: "GET",
        url: "/",
        description: "post some data",
        handler: function (request, reply) {
            reply.send("best-matches");
        }
    });

    done();
}
