module.exports = (async () => {
    const standardReact = require("eslint-config-standard-react");
    const standardReactClone = {...standardReact};
    delete standardReactClone.parserOptions;
    standardReactClone.languageOptions = {
        ecmaVersion: 2021,
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
        sourceType: "module",
    };
    standardReactClone.plugins = {
        react: require("eslint-plugin-react"),
        "react-hooks": require("eslint-plugin-react-hooks"),
    };
    return [
        standardReactClone,
        require("eslint-config-prettier"),
        {
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
        },
    ];
})();
