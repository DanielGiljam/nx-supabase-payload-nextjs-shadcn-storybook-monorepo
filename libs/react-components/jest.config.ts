export default {
    displayName: "react-components",
    preset: "../../jest.preset.cjs",
    transform: {
        "^.+\\.[tj]sx?$": [
            "@swc/jest",
            {
                jsc: {
                    parser: {syntax: "typescript", tsx: true},
                    transform: {react: {runtime: "automatic"}},
                },
            },
        ],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    coverageDirectory: "../../coverage/libs/react-components",
};
