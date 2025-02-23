import jwt from "jsonwebtoken";
import type {CollectionConfig, FieldHook} from "payload";
import z from "zod";

import {authenticated} from "../access";
import type {User} from "../payload-types";
import {createSupabaseClient} from "../supabase";
import {zodToFieldJsonSchema} from "../utils";

const emailAfterRead: FieldHook<User> = ({data}) =>
    data?.supabaseUserMetadata?.email;

const nameAfterRead: FieldHook<User> = ({data}) =>
    data?.supabaseUserMetadata?.name;

const supabaseUserMetadataSchema = z
    .object({
        name: z.string(),
        email: z.string().email(),
    })
    .passthrough();

const jwtPayloadSchema = z.object({
    sub: z.string().uuid(),
    user_metadata: supabaseUserMetadataSchema,
});

const getJwtPayload = (accessToken: string) => {
    const verifyResult = jwt.verify(
        accessToken,
        process.env["SUPABASE_JWT_SECRET"]!,
    );
    return jwtPayloadSchema.parse(verifyResult);
};

export const Users: CollectionConfig = {
    slug: "users",
    access: {
        admin: authenticated,
        create: authenticated,
        delete: authenticated,
        read: authenticated,
        update: authenticated,
    },
    admin: {
        useAsTitle: "email",
    },
    auth: {
        disableLocalStrategy: true,
        strategies: [
            {
                name: "supabase",
                authenticate: async ({headers, payload}) => {
                    const responseHeaders = new Headers();
                    const supabase = createSupabaseClient(
                        headers,
                        responseHeaders,
                    );
                    const {
                        data: {session},
                        error,
                    } = await supabase.auth.getSession();
                    if (error != null) {
                        throw error;
                    }
                    if (session == null) {
                        return {
                            user: null,
                        };
                    }
                    const jwtPayload = getJwtPayload(session.access_token);
                    let {
                        docs: [user],
                    } = await payload.find({
                        collection: "users",
                        where: {
                            supabaseUid: {
                                equals: jwtPayload.sub,
                            },
                        },
                        limit: 1,
                    });
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- user can indeed be null since array where it was taken from could be empty
                    if (user == null) {
                        user = await payload.create({
                            collection: "users",
                            data: {
                                email: jwtPayload.user_metadata.email,
                                name: jwtPayload.user_metadata.name,
                                supabaseUid: jwtPayload.sub,
                                supabaseUserMetadata: jwtPayload.user_metadata,
                            },
                        });
                    }
                    return {
                        user: {
                            ...user,
                            collection: "users",
                            _strategy: "supabase",
                        },
                        responseHeaders,
                    };
                },
            },
        ],
    },
    fields: [
        {
            name: "email",
            type: "email",
            required: true,
            unique: true,
            virtual: true,
            admin: {
                readOnly: true,
            },
            hooks: {
                afterRead: [emailAfterRead],
            },
        },
        {
            name: "name",
            type: "text",
            required: true,
            virtual: true,
            admin: {
                readOnly: true,
            },
            hooks: {
                afterRead: [nameAfterRead],
            },
        },
        {
            name: "supabaseUid",
            type: "text",
            required: true,
            unique: true,
            index: true,
            admin: {
                readOnly: true,
            },
        },
        {
            name: "supabaseUserMetadata",
            type: "json",
            required: true,
            jsonSchema: zodToFieldJsonSchema(supabaseUserMetadataSchema),
            admin: {
                disableListColumn: true,
                disableListFilter: true,
                readOnly: true,
            },
        },
    ],
    hooks: {
        afterLogout: [
            async ({req}) => {
                if (req.responseHeaders == null) {
                    throw new TypeError("req.responseHeaders is not defined");
                }
                const supabase = createSupabaseClient(
                    req.headers,
                    req.responseHeaders,
                );
                await supabase.auth.signOut({scope: "local"});
            },
        ],
    },
    timestamps: true,
};
