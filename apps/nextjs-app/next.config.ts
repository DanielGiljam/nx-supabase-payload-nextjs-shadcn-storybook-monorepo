//@ts-check

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
};

const plugins = [
    // Add more Next.js plugins to this list if needed.
    withNx,
    withPayload,
];

module.exports = composePlugins(...plugins)(nextConfig);
