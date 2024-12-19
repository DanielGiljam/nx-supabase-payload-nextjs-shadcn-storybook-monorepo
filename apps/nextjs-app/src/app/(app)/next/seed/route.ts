import config from "@my-project/payload/config";
import {headers} from "next/headers";
import {getPayload} from "payload";

import {seed} from "./_/seed";

export const maxDuration = 60; // This function can run for a maximum of 60 seconds

export const POST = async (): Promise<Response> => {
    const payload = await getPayload({config});
    const requestHeaders = await headers();

    // Authenticate by passing request headers
    const {user} = await payload.auth({headers: requestHeaders});

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
    if (!user) {
        return new Response("Action forbidden.", {status: 403});
    }

    try {
        await seed({payload});

        return Response.json({success: true});
    } catch {
        return new Response("Error seeding data.");
    }
};
