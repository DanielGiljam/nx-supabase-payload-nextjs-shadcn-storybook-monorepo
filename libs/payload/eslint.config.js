import path from "node:path";
import url from "node:url";

import baseConfig from "../../eslint.config.js";

const filename = url.fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default [
    ...baseConfig,
    {
        ignores: ["src/payload-types.ts"],
    },
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
        files: ["**/*.ts", "**/*.js"],
        // Override or add rules here
        rules: {},
    },
];
