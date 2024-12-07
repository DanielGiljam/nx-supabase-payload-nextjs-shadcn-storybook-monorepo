import baseConfig from "../../eslint.config.js";

export default [
    ...baseConfig,
    {
        rules: {
            "unicorn/prefer-module": "off",
        },
    },
];
