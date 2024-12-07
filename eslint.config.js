import path from "node:path";
import url from "node:url";

import ecmascript from "@my-project/eslint-config-ecmascript";
import nx from "@nx/eslint-plugin";

const filename = url.fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/**
 * @type {import("eslint").Linter.Config[]}
 */
export default [
    ...nx.configs["flat/base"],
    ...nx.configs["flat/typescript"],
    ...nx.configs["flat/javascript"],
    {
        ignores: ["**/dist"],
    },
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        rules: {
            "@nx/enforce-module-boundaries": [
                "error",
                {
                    enforceBuildableLibDependency: true,
                    allow: ["^.*/eslint(\\.base)?\\.config\\.[cm]?js$"],
                    depConstraints: [
                        {
                            sourceTag: "*",
                            onlyDependOnLibsWithTags: ["*"],
                        },
                    ],
                },
            ],
        },
    },
    ...ecmascript.map((config) => ({
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        ...config,
    })),
    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ["eslint.config.js"],
                },
                tsconfigRootDir: dirname,
            },
        },
    },
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        // Override or add rules here
        rules: {
            "@typescript-eslint/no-non-null-assertion": "off",
        },
    },
];
