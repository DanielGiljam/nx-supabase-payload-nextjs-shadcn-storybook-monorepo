/* eslint-disable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions */

import {canUseDom} from "./canUseDom";

export const getServerSideUrl = (request?: Partial<Request>) => {
    if (request?.url) {
        const url = new URL(request.url);
        return url.origin;
    }
    const protocol = process.env["HTTP_PROTOCOL"] || "https:";
    if (request?.headers) {
        const host = request.headers.get("host");
        if (host) {
            return `${protocol}//${host}`;
        }
    }
    if (process.env["VERCEL_URL"]) {
        return `${protocol}//${process.env["VERCEL_URL"]}`;
    }
    if (process.env["VERCEL_BRANCH_URL"]) {
        return `${protocol}//${process.env["VERCEL_BRANCH_URL"]}`;
    }
    if (process.env["VERCEL_PROJECT_PRODUCTION_URL"]) {
        return `${protocol}//${process.env["VERCEL_PROJECT_PRODUCTION_URL"]}`;
    }
    if (process.env["NEXT_PUBLIC_SERVER_URL"]) {
        return process.env["NEXT_PUBLIC_SERVER_URL"];
    }

    throw new Error("Unable to get server-side URL");
};

export const getClientSideUrl = () => {
    if (canUseDom) {
        const protocol = globalThis.location.protocol;
        const domain = globalThis.location.hostname;
        const port = globalThis.location.port;

        return `${protocol}//${domain}${port ? `:${port}` : ""}`;
    }

    if (process.env["VERCEL_PROJECT_PRODUCTION_URL"]) {
        const protocol = process.env["HTTP_PROTOCOL"] || "https:";
        return `${protocol}//${process.env["VERCEL_PROJECT_PRODUCTION_URL"]}`;
    }

    return process.env["NEXT_PUBLIC_SERVER_URL"] || "";
};
