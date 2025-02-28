import {getServerSideUrl} from "@my-project/utils";
import {
    MetaDescriptionField,
    MetaImageField,
    MetaTitleField,
    OverviewField,
    PreviewField,
} from "@payloadcms/plugin-seo/fields";
import {
    BlocksFeature,
    FixedToolbarFeature,
    HeadingFeature,
    HorizontalRuleFeature,
    InlineToolbarFeature,
    lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type {CollectionConfig} from "payload";

import {authenticated, authenticatedOrPublished} from "../../access";
import {Banner, Code, MediaBlock} from "../../blocks";
import {slug} from "../../fields";
import {generatePreviewPath} from "../../utils";

import {populateAuthors, revalidatePost} from "./hooks";

export const Posts: CollectionConfig<"posts"> = {
    slug: "posts",
    access: {
        create: authenticated,
        delete: authenticated,
        read: authenticatedOrPublished,
        update: authenticated,
    },
    // This config controls what's populated by default when a post is referenced
    // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
    // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
    defaultPopulate: {
        title: true,
        slug: true,
        categories: true,
        meta: {
            image: true,
            description: true,
        },
    },
    admin: {
        defaultColumns: ["title", "slug", "updatedAt"],
        livePreview: {
            url: ({data, req}) => {
                const path = generatePreviewPath({
                    slug:
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- [bulk suppress]
                        typeof data?.["slug"] === "string" ? data["slug"] : "",
                    collection: "posts",
                });

                return `${getServerSideUrl(
                    // only pass req.headers because rest of req object is untrustworthy (mocked or something)
                    {headers: req.headers},
                )}${path}`;
            },
        },
        preview: (data, {req}) => {
            const path = generatePreviewPath({
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- [bulk suppress]
                slug: typeof data?.["slug"] === "string" ? data["slug"] : "",
                collection: "posts",
            });

            return `${getServerSideUrl(req)}${path}`;
        },
        useAsTitle: "title",
    },
    fields: [
        {
            name: "title",
            type: "text",
            required: true,
        },
        {
            type: "tabs",
            tabs: [
                {
                    fields: [
                        {
                            name: "content",
                            type: "richText",
                            editor: lexicalEditor({
                                features: ({rootFeatures}) => [
                                    ...rootFeatures,
                                    HeadingFeature({
                                        enabledHeadingSizes: [
                                            "h1",
                                            "h2",
                                            "h3",
                                            "h4",
                                        ],
                                    }),
                                    BlocksFeature({
                                        blocks: [Banner, Code, MediaBlock],
                                    }),
                                    FixedToolbarFeature(),
                                    InlineToolbarFeature(),
                                    HorizontalRuleFeature(),
                                ],
                            }),
                            label: false,
                            required: true,
                        },
                    ],
                    label: "Content",
                },
                {
                    fields: [
                        {
                            name: "relatedPosts",
                            type: "relationship",
                            admin: {
                                position: "sidebar",
                            },
                            filterOptions: ({id}) => ({
                                id: {
                                    not_in: [id],
                                },
                            }),
                            hasMany: true,
                            relationTo: "posts",
                        },
                        {
                            name: "categories",
                            type: "relationship",
                            admin: {
                                position: "sidebar",
                            },
                            hasMany: true,
                            relationTo: "categories",
                        },
                    ],
                    label: "Meta",
                },
                {
                    name: "meta",
                    label: "SEO",
                    fields: [
                        OverviewField({
                            titlePath: "meta.title",
                            descriptionPath: "meta.description",
                            imagePath: "meta.image",
                        }),
                        MetaTitleField({
                            hasGenerateFn: true,
                        }),
                        MetaImageField({
                            relationTo: "media",
                        }),

                        MetaDescriptionField({}),
                        PreviewField({
                            // if the `generateUrl` function is configured
                            hasGenerateFn: true,

                            // field paths to match the target field for data
                            titlePath: "meta.title",
                            descriptionPath: "meta.description",
                        }),
                    ],
                },
            ],
        },
        {
            name: "publishedAt",
            type: "date",
            admin: {
                date: {
                    pickerAppearance: "dayAndTime",
                },
                position: "sidebar",
            },
            hooks: {
                beforeChange: [
                    ({siblingData, value}) => {
                        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
                        if (siblingData["_status"] === "published" && !value) {
                            return new Date();
                        }
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- [bulk suppress]
                        return value;
                    },
                ],
            },
        },
        {
            name: "authors",
            type: "relationship",
            admin: {
                position: "sidebar",
            },
            hasMany: true,
            relationTo: "users",
        },
        // This field is only used to populate the user data via the `populateAuthors` hook
        // This is because the `user` collection has access control locked to protect user privacy
        // GraphQL will also not return mutated user data that differs from the underlying schema
        {
            name: "populatedAuthors",
            type: "array",
            access: {
                update: () => false,
            },
            admin: {
                disabled: true,
                readOnly: true,
            },
            fields: [
                {
                    name: "id",
                    type: "text",
                },
                {
                    name: "name",
                    type: "text",
                },
            ],
        },
        ...slug(),
    ],
    hooks: {
        afterChange: [revalidatePost],
        afterRead: [populateAuthors],
    },
    versions: {
        drafts: {
            autosave: {
                interval: 100, // We set this interval for optimal live preview
            },
        },
        maxPerDoc: 50,
    },
};
