import {getServerSideUrl} from "@my-project/utils";
import {
    MetaDescriptionField,
    MetaImageField,
    MetaTitleField,
    OverviewField,
    PreviewField,
} from "@payloadcms/plugin-seo/fields";
import type {CollectionConfig} from "payload";

import {authenticated, authenticatedOrPublished} from "../../access";
import {
    Archive,
    CallToAction,
    Content,
    FormBlock,
    MediaBlock,
} from "../../blocks";
import {hero, slug} from "../../fields";
import {populatePublishedAt} from "../../hooks";
import {generatePreviewPath} from "../../utils";

import {revalidatePage} from "./hooks";

export const Pages: CollectionConfig<"pages"> = {
    slug: "pages",
    access: {
        create: authenticated,
        delete: authenticated,
        read: authenticatedOrPublished,
        update: authenticated,
    },
    // This config controls what's populated by default when a page is referenced
    // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
    // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pagess'>
    defaultPopulate: {
        title: true,
        slug: true,
    },
    admin: {
        defaultColumns: ["title", "slug", "updatedAt"],
        livePreview: {
            url: ({data, req}) => {
                const path = generatePreviewPath({
                    slug:
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- [bulk suppress]
                        typeof data?.["slug"] === "string" ? data["slug"] : "",
                    collection: "pages",
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
                collection: "pages",
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
                    fields: [hero()],
                    label: "Hero",
                },
                {
                    fields: [
                        {
                            name: "layout",
                            type: "blocks",
                            blocks: [
                                CallToAction,
                                Content,
                                MediaBlock,
                                Archive,
                                FormBlock,
                            ],
                            required: true,
                        },
                    ],
                    label: "Content",
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
                position: "sidebar",
            },
        },
        ...slug(),
    ],
    hooks: {
        afterChange: [revalidatePage],
        beforeChange: [populatePublishedAt],
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
