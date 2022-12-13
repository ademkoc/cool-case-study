import Ajv from "ajv";
import dotenv from "dotenv";

dotenv.config();

const ajv = new Ajv({
    allErrors: true,
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    allowUnionTypes: true,
    addUsedSchema: false
});

export default function (opts) {
    if (!opts.schema) {
        throw new Error("Schema must be provided");
    }

    const schema = opts.schema;
    schema.additionalProperties = false;

    let merge = process.env;

    const valid = ajv.validate(opts.schema, merge);

    if (valid === false) {
        const error = new Error(ajv.errorsText(ajv.errors, {dataVar: "env"}));
        error.errors = ajv.errors;
        throw error;
    }

    return merge;
}
