import {startServer} from "./server.js";
import checkEnv from "./utils/check-env.js";

const env = checkEnv({
    schema: {
        type: "object",
        required: ["HOST", "PORT", "MONGODB_CONNECTION_STRING"],
        properties: {
            HOST: {
                type: "string",
                default: "0.0.0.0"
            },
            PORT: {
                type: "string",
                default: 3000
            },
            MONGODB_CONNECTION_STRING: {
                type: "string"
            }
        }
    }
});

startServer({env});
