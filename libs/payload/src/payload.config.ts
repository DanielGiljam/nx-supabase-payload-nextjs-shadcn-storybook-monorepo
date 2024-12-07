import path from "node:path";
import {fileURLToPath} from "node:url";

import {postgresAdapter} from "@payloadcms/db-postgres";
import {s3Storage} from "@payloadcms/storage-s3";
import {buildConfig} from "payload";
import sharp from "sharp";

import {Media} from "./collections/media";
import {Users} from "./collections/users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
    admin: {
        user: Users.slug,
        importMap: {
            baseDir: path.resolve(dirname),
        },
    },
    collections: [Users, Media],
    secret: process.env["PAYLOAD_SECRET"]!,
    typescript: {
        outputFile: path.resolve(dirname, "payload-types.ts"),
    },
    db: postgresAdapter({
        pool: {
            connectionString: process.env["DATABASE_URI"]!,
        },
    }),
    sharp,
    plugins: [
        s3Storage({
            collections: {
                media: {
                    prefix: "media",
                },
            },
            bucket: process.env["S3_BUCKET"]!,
            config: {
                forcePathStyle: true, // Important for using Supabase
                credentials: {
                    accessKeyId: process.env["S3_ACCESS_KEY_ID"]!,
                    secretAccessKey: process.env["S3_SECRET_ACCESS_KEY"]!,
                },
                region: process.env["S3_REGION"],
                endpoint: process.env["S3_ENDPOINT"],
            },
        }),
    ],
});
