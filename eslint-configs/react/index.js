/**
 * @type {import("eslint").Linter.LegacyConfig}
 */
module.exports = {
    extends: ["standard-jsx", "standard-react", "prettier"],
    rules: {
        quotes: [
            "warn",
            "double",
            {
                avoidEscape: true,
                allowTemplateLiterals: false,
            },
        ],
        "react/jsx-curly-brace-presence": [
            "warn",
            {
                props: "always",
                children: "never",
            },
        ],
        "react/jsx-sort-props": [
            "warn",
            {
                callbacksLast: true,
                shorthandLast: true,
                ignoreCase: true,
                reservedFirst: true,
            },
        ],
        "react/prop-types": "off",
    },
};
