import {fixupConfigRules} from "@eslint/compat";
import {FlatCompat} from "@eslint/eslintrc";
import nx from "@nx/eslint-plugin";
import baseConfig from "../../eslint.config.js";

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});

export default [
    ...baseConfig,
    ...nx.configs["flat/react"],
    ...fixupConfigRules(
        compat.config({
            overrides: [
                {
                    files: ["**/*.tsx", "**/*.jsx"],
                    extends: ["@my-project/react"],
                },
            ],
        }),
    ),
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        // Override or add rules here
        rules: {},
    },
];
