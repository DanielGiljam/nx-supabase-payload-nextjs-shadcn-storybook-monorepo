import path from "node:path";
import url from "node:url";

import {fixupConfigRules} from "@eslint/compat";
import {FlatCompat} from "@eslint/eslintrc";
import nx from "@nx/eslint-plugin";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";

import baseConfig from "../../eslint.config.js";

const filename = url.fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const compat = new FlatCompat({
    baseDirectory: dirname,
});

export default [
    ...baseConfig,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- @nx/eslint-plugin doesn't have type definitions so typescript-eslint complains about it
    ...nx.configs["flat/react"],
    ...fixupConfigRules(
        compat.config({
            overrides: [
                {
                    files: ["**/*.tsx", "**/*.jsx"],
                    extends: ["@my-project/react", "plugin:react/jsx-runtime"],
                },
            ],
        }),
    )
        // temporary workaround for https://github.com/eslint/eslintrc/issues/135
        .map((config) => {
            if (config.plugins?.react != null) {
                config.plugins.react = eslintPluginReact;
            }
            if (config.plugins?.["react-hooks"] != null) {
                config.plugins["react-hooks"] = eslintPluginReactHooks;
            }
            return config;
        }),
    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: [
                        "eslint.config.js",
                        "postcss.config.cjs",
                        "tailwind.config.cjs",
                    ],
                },
                tsconfigRootDir: dirname,
            },
        },
    },
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        // Override or add rules here
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    /* Same as in @my-project/eslint-config-ecmascript */
                    paths: [
                        {
                            name: "react",
                            allowImportNames: ["default"],
                            message: "Only React default import is allowed.",
                        },
                    ],
                    /* Same as in @my-project/eslint-config-ecmascript END */
                    patterns: [
                        {
                            // Deep relative import are not allowed, except for from lib/utils and ui/* (one level deep)
                            regex: String.raw`(\.{1,2}\/)(\.{2}\/)*(?!(lib\/utils|ui\/[^./]+)$)(\.+[^./]+[^/]*|[^./][^/]*)\/`,
                            message: "Deep relative imports are not allowed.",
                        },
                    ],
                },
            ],
        },
    },
];
