/* eslint-disable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions */

import {canUseDom} from "./canUseDom";

export const getServerSideUrl = () => {
    if (process.env["VERCEL_URL"]) {
        return `https://${process.env["VERCEL_URL"]}`;
    }
    if (process.env["VERCEL_BRANCH_URL"]) {
        return `https://${process.env["VERCEL_BRANCH_URL"]}`;
    }
    if (process.env["VERCEL_PROJECT_PRODUCTION_URL"]) {
        return `https://${process.env["VERCEL_PROJECT_PRODUCTION_URL"]}`;
    }

    return process.env["NEXT_PUBLIC_SERVER_URL"] || "";
};

export const getClientSideUrl = () => {
    if (canUseDom) {
        const protocol = globalThis.location.protocol;
        const domain = globalThis.location.hostname;
        const port = globalThis.location.port;

        return `${protocol}//${domain}${port ? `:${port}` : ""}`;
    }

    if (process.env["VERCEL_PROJECT_PRODUCTION_URL"]) {
        return `https://${process.env["VERCEL_PROJECT_PRODUCTION_URL"]}`;
    }

    return process.env["NEXT_PUBLIC_SERVER_URL"] || "";
};
