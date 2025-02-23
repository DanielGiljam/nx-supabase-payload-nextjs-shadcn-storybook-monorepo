import path from "node:path";
import url from "node:url";

import love from "eslint-config-love";
import prettier from "eslint-config-prettier";
import unicorn from "eslint-plugin-unicorn";

const filename = url.fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/**
 * @type {import("eslint").Linter.Config[]}
 */
export default [
    {
        name: "love",
        ...love,
    },
    unicorn.configs["flat/all"],
    {
        name: "prettier",
        ...prettier,
    },
    {
        rules: {
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/init-declarations": "off",
            "@typescript-eslint/no-magic-numbers": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-require-imports": "off", // we have unicorn/prefer-module configured instead
            "@typescript-eslint/no-unsafe-type-assertion": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    args: "all",
                    argsIgnorePattern: "^_",
                    ignoreRestSiblings: true,
                    caughtErrors: "all",
                },
            ],
            "@typescript-eslint/prefer-destructuring": "off",
            complexity: "off",
            "func-names": ["warn", "always"],
            "eslint-comments/require-description": "off",
            "func-name-matching": [
                "warn",
                "always",
                {
                    considerPropertyDescriptor: true,
                },
            ],
            "func-style": ["warn", "expression"],
            "import/no-anonymous-default-export": "off",
            "import/no-extraneous-dependencies": [
                "error",
                {
                    packageDir: path.resolve(dirname, "../../"),
                },
            ],
            "import/order": [
                "warn",
                {
                    pathGroupsExcludedImportTypes: ["unknown"],
                    "newlines-between": "always",
                    alphabetize: {
                        order: "asc",
                    },
                },
            ],
            "import/no-useless-path-segments": [
                "error",
                {
                    noUselessIndex: true,
                },
            ],
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        {
                            name: "react",
                            allowImportNames: ["default"],
                            message: "Only React default import is allowed.",
                        },
                    ],
                    patterns: [
                        {
                            regex: String.raw`(\.{1,2}\/)(\.{2}\/)*(\.+[^./]+[^/]*|[^./][^/]*)\/`,
                            message: "Deep relative imports are not allowed.",
                        },
                    ],
                },
            ],
            "no-unused-vars": "off",
            quotes: [
                "warn",
                "double",
                {
                    avoidEscape: true,
                    allowTemplateLiterals: false,
                },
            ],
            "sort-imports": [
                "warn",
                {
                    ignoreDeclarationSort: true,
                    memberSyntaxSortOrder: [
                        "all",
                        "single",
                        "multiple",
                        "none",
                    ],
                },
            ],
            "unicorn/no-null": "off",
            "unicorn/no-keyword-prefix": "off",
            "unicorn/prefer-json-parse-buffer": "off",
            "unicorn/prevent-abbreviations": [
                "error",
                {
                    replacements: {
                        args: false,
                        props: false,
                        ref: false,
                    },
                    allowList: {
                        generateStaticParams: true,
                        urlSearchParams: true,
                    },
                },
            ],
        },
    },
];
