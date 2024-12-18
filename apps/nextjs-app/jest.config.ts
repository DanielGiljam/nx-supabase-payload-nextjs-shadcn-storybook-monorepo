export default {
    displayName: "nextjs-app",
    preset: "../../jest.preset.cjs",
    transform: {
        "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "@nx/react/plugins/jest",
        "^.+\\.[tj]sx?$": ["babel-jest", {presets: ["@nx/next/babel"]}],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    coverageDirectory: "../../coverage/apps/nextjs-app",
};
