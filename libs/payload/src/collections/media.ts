import path from "node:path";
import {fileURLToPath} from "node:url";

import {
    FixedToolbarFeature,
    InlineToolbarFeature,
    lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type {CollectionConfig} from "payload";

import {anyone, authenticated} from "../access";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Media: CollectionConfig = {
    slug: "media",
    access: {
        create: authenticated,
        delete: authenticated,
        read: anyone,
        update: authenticated,
    },
    fields: [
        {
            name: "alt",
            type: "text",
            //required: true,
        },
        {
            name: "caption",
            type: "richText",
            editor: lexicalEditor({
                features: ({rootFeatures}) => [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                ],
            }),
        },
    ],
    upload: {
        // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
        staticDir: path.resolve(dirname, "../../public/media"),
        adminThumbnail: "thumbnail",
        imageSizes: [
            {
                name: "thumbnail",
                width: 300,
            },
            {
                name: "square",
                width: 500,
                height: 500,
            },
            {
                name: "small",
                width: 600,
            },
            {
                name: "medium",
                width: 900,
            },
            {
                name: "large",
                width: 1400,
            },
            {
                name: "xlarge",
                width: 1920,
            },
        ],
    },
};
