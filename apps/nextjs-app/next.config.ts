//@ts-check
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable @typescript-eslint/require-await */

const {composePlugins, withNx} = require("@nx/next");
const {withPayload} = require("@payloadcms/next/withPayload");

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
    nx: {
        // Set this to true if you would like to use SVGR
        // See: https://github.com/gregberge/svgr
        svgr: false,
    },
    reactStrictMode: true,
    redirects: async () => [
        {
            destination: "/ie-incompatible.html",
            has: [
                {
                    type: "header",
                    key: "user-agent",
                    value: "(.*Trident.*)", // all ie browsers
                },
            ],
            permanent: false,
            source: "/:path((?!ie-incompatible.html$).*)", // all pages except the incompatibility page
        },
    ],
    sassOptions: {
        silenceDeprecations: ["import", "legacy-js-api"],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
const withHeaders = (config: import("next").NextConfig) => ({
    ...config,
    headers: async () => [
        ...((await config.headers?.()) ?? []),
        {
            source: "/:path*",
            headers: [
                {
                    key: "Vary",
                    value: "Accept-Language, Cookie, Sec-CH-Prefers-Color-Scheme",
                },
            ],
        },
    ],
});

const plugins = [
    // Add more Next.js plugins to this list if needed.
    withNx,
    withPayload,
    withHeaders,
];

module.exports = composePlugins(...plugins)(nextConfig);
