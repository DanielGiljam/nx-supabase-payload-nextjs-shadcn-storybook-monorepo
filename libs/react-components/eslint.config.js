import {fixupConfigRules} from "@eslint/compat";
import {FlatCompat} from "@eslint/eslintrc";
import nx from "@nx/eslint-plugin";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
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
    )
        // temporary workaround for https://github.com/eslint/eslintrc/issues/135
        .map((config) => {
            if (config.plugins?.react) {
                config.plugins.react = eslintPluginReact;
            }
            if (config.plugins?.["react-hooks"]) {
                config.plugins["react-hooks"] = eslintPluginReactHooks;
            }
            return config;
        }),
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        // Override or add rules here
        rules: {},
    },
];
