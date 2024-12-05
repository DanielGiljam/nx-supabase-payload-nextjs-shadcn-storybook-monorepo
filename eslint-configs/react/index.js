module.exports = {
    extends: ["standard-react", "prettier"],
    rules: {
        "react/jsx-curly-brace-presence": [
            "warn",
            {props: "always", children: "never"},
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
    },
};
