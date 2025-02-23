import configPromise from "@my-project/payload/config";
import jwt from "jsonwebtoken";
import {draftMode} from "next/headers";
import {redirect} from "next/navigation";
import {getPayload} from "payload";
import type {CollectionSlug} from "payload";

const payloadToken = "payload-token";

export const GET = async (
    request: Request & {
        cookies: {
            get: (name: string) => {
                value: string;
            };
        };
    },
): Promise<Response> => {
    const payload = await getPayload({config: configPromise});
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- [bulk suppress]
    const token = request.cookies.get(payloadToken)?.value;
    const {searchParams} = new URL(request.url);
    const path = searchParams.get("path");
    const collection = searchParams.get("collection") as CollectionSlug;
    const slug = searchParams.get("slug");

    const previewSecret = searchParams.get("previewSecret");

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
    if (previewSecret) {
        return new Response("You are not allowed to preview this page", {
            status: 403,
        });
    } else {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
        if (!path) {
            return new Response("No path provided", {status: 404});
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
        if (!collection) {
            return new Response("No path provided", {status: 404});
        }

        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
        if (!slug) {
            return new Response("No path provided", {status: 404});
        }

        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
        if (!token) {
            return new Response("You are not allowed to preview this page", {
                status: 403,
            });
        }

        if (!path.startsWith("/")) {
            return new Response(
                "This endpoint can only be used for internal previews",
                {status: 500},
            );
        }

        let user;

        try {
            user = jwt.verify(token, payload.secret);
        } catch (error) {
            payload.logger.error(
                "Error verifying token for live preview:",
                error,
            );
        }

        const draft = await draftMode();

        // You can add additional checks here to see if the user is allowed to preview this page
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
        if (!user) {
            draft.disable();
            return new Response("You are not allowed to preview this page", {
                status: 403,
            });
        }

        // Verify the given slug exists
        try {
            const documents = await payload.find({
                collection,
                draft: true,
                limit: 1,
                // pagination: false reduces overhead if you don't need totalDocs
                pagination: false,
                depth: 0,
                select: {},
                where: {
                    slug: {
                        equals: slug,
                    },
                },
            });

            if (documents.docs.length === 0) {
                return new Response("Document not found", {status: 404});
            }
        } catch (error) {
            payload.logger.error(
                "Error verifying token for live preview:",
                error,
            );
        }

        draft.enable();

        redirect(path);
    }
};
