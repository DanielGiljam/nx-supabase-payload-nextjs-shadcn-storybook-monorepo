import love from "eslint-config-love";
import prettier from "eslint-config-prettier";

const {import: _import, ...lovePlugins} = love.plugins;

export default [
    {
        name: "love",
        ...love,
    },
    {
        name: "prettier",
        ...prettier,
    },
    {
        rules: {
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    args: "all",
                    argsIgnorePattern: "^_",
                    ignoreRestSiblings: true,
                    caughtErrors: "all",
                },
            ],
            "func-names": ["warn", "always"],
            "func-name-matching": [
                "warn",
                "always",
                {
                    considerPropertyDescriptor: true,
                },
            ],
            "func-style": ["warn", "expression"],
            "import/no-extraneous-dependencies": "error",
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
            "no-unused-vars": "off",
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
        },
    },
];
