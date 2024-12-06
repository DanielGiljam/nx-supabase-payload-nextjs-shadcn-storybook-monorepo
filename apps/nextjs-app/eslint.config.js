import {fixupConfigRules} from "@eslint/compat";
import {FlatCompat} from "@eslint/eslintrc";
import js from "@eslint/js";
import nx from "@nx/eslint-plugin";
import eslintPluginImport from "eslint-plugin-import";
import baseConfig from "../../eslint.config.js";

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
    recommendedConfig: js.configs.recommended,
});

export default [
    ...fixupConfigRules(compat.extends("next"))
        // temporary workaround for https://github.com/eslint/eslintrc/issues/135
        .map((config) => {
            if (config.plugins?.import) {
                config.plugins.import = eslintPluginImport;
            }
            return config;
        }),

    ...fixupConfigRules(compat.extends("next/core-web-vitals"))
        // temporary workaround for https://github.com/eslint/eslintrc/issues/135
        .map((config) => {
            if (config.plugins?.import) {
                config.plugins.import = eslintPluginImport;
            }
            return config;
        }),

    ...baseConfig,
    ...nx.configs["flat/react-typescript"],
    ...fixupConfigRules(
        compat.config({
            overrides: [
                {
                    files: ["**/*.tsx", "**/*.jsx"],
                    extends: ["@my-project/react", "plugin:react/jsx-runtime"],
                },
            ],
        }),
    ),
    {
        ignores: [
            ".next/**/*",
            "src/app/(payload)/**/*",
            "index.d.ts",
            "next-env.d.ts",
        ],
    },
];
