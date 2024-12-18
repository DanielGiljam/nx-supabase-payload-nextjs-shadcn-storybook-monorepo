import path from "node:path";
import url from "node:url";

import {fixupConfigRules} from "@eslint/compat";
import {FlatCompat} from "@eslint/eslintrc";
import js from "@eslint/js";
import nx from "@nx/eslint-plugin";
import eslintPluginImport from "eslint-plugin-import";

import baseConfig from "../../eslint.config.js";

const filename = url.fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const compat = new FlatCompat({
    baseDirectory: dirname,
    recommendedConfig: js.configs.recommended,
});

export default [
    ...fixupConfigRules(compat.extends("next"))
        // temporary workaround for https://github.com/eslint/eslintrc/issues/135
        .map((config) => {
            if (config.plugins?.import != null) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- eslint-plugin-import doesn't have type definitions so typescript-eslint complains about it
                config.plugins.import = eslintPluginImport;
            }
            return config;
        }),

    ...fixupConfigRules(compat.extends("next/core-web-vitals"))
        // temporary workaround for https://github.com/eslint/eslintrc/issues/135
        .map((config) => {
            if (config.plugins?.import != null) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- eslint-plugin-import doesn't have type definitions so typescript-eslint complains about it
                config.plugins.import = eslintPluginImport;
            }
            return config;
        }),

    ...baseConfig,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- @nx/eslint-plugin doesn't have type definitions so typescript-eslint complains about it
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
    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: [
                        "jest.config.ts",
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
            "@nx/enforce-module-boundaries": [
                "error",
                {
                    /* Same as in ../../eslint.config.js */
                    enforceBuildableLibDependency: true,
                    allow: [String.raw`^.*/eslint(\.base)?\.config\.[cm]?js$`],
                    depConstraints: [
                        {
                            sourceTag: "*",
                            onlyDependOnLibsWithTags: ["*"],
                        },
                    ],
                    /* Same as in ../../eslint.config.js END */
                    allowCircularSelfDependency: true,
                },
            ],
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
                    // Disable "deep relative imports are not allowed"
                    /* patterns: [
                        {
                            regex: String.raw`(\.{1,2}\/)(\.{2}\/)*(\.+[^./]+[^/]*|[^./][^/]*)\/`,
                            message: "Deep relative imports are not allowed.",
                        },
                    ], */
                },
            ],
            "unicorn/filename-case": [
                "error",
                {
                    cases: {
                        camelCase: true,
                        pascalCase: true,
                    },
                },
            ],
        },
    },
];
