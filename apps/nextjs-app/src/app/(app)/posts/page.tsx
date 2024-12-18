import configPromise from "@my-project/payload/config";
import type {Metadata} from "next/types";
import {getPayload} from "payload";

import PageClient from "./page.client";

import {CollectionArchive} from "~/components/misc/CollectionArchive";
import {PageRange} from "~/components/pagination/PageRange";
import {Pagination} from "~/components/pagination/Pagination";

export const dynamic = "force-static";
export const revalidate = 600;

export default async function Page() {
    const payload = await getPayload({config: configPromise});

    const posts = await payload.find({
        collection: "posts",
        depth: 1,
        limit: 12,
        overrideAccess: false,
        select: {
            title: true,
            slug: true,
            categories: true,
            meta: true,
        },
    });

    return (
        <div className={"pb-24 pt-24"}>
            <PageClient />
            <div className={"container mb-16"}>
                <div className={"prose max-w-none dark:prose-invert"}>
                    <h1>Posts</h1>
                </div>
            </div>

            <div className={"container mb-8"}>
                <PageRange
                    collection={"posts"}
                    currentPage={posts.page}
                    limit={12}
                    totalDocs={posts.totalDocs}
                />
            </div>

            <CollectionArchive posts={posts.docs} />

            <div className={"container"}>
                {/* eslint-disable-next-line @typescript-eslint/no-magic-numbers, @typescript-eslint/strict-boolean-expressions -- [bulk suppress] */}
                {posts.totalPages > 1 && posts.page && (
                    <Pagination
                        page={posts.page}
                        totalPages={posts.totalPages}
                    />
                )}
            </div>
        </div>
    );
}

export const generateMetadata = (): Metadata => ({
    title: "Payload Website Template Posts",
});
