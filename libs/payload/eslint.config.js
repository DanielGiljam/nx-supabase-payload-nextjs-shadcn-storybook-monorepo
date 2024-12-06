import baseConfig from "../../eslint.config.js";

export default [
    ...baseConfig,
    {
        ignores: ["src/payload-types.ts"],
    },
];
