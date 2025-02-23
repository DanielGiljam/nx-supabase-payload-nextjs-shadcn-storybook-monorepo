import configPromise from "@my-project/payload/config";
import {notFound} from "next/navigation";
import type {Metadata} from "next/types";
import {getPayload} from "payload";

import PageClient from "./page.client";

import {CollectionArchive} from "~/components/misc/CollectionArchive";
import {PageRange} from "~/components/pagination/PageRange";
import {Pagination} from "~/components/pagination/Pagination";
import {translation} from "~/i18n/server";

export const revalidate = 600;

interface Args {
    params: Promise<{
        pageNumber: string;
    }>;
}

export default async function Page({params: parametersPromise}: Args) {
    const {pageNumber} = await parametersPromise;
    const payload = await getPayload({config: configPromise});
    const {t} = await translation();

    const sanitizedPageNumber = Number(pageNumber);

    if (!Number.isInteger(sanitizedPageNumber)) notFound();

    const posts = await payload.find({
        collection: "posts",
        depth: 1,
        limit: 12,
        page: sanitizedPageNumber,
        overrideAccess: false,
    });

    return (
        <div className={"pb-24 pt-24"}>
            <PageClient />
            <div className={"container mb-16"}>
                <div className={"prose max-w-none dark:prose-invert"}>
                    <h1>{t("posts.page.heading")}</h1>
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
                {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition -- [bulk suppress] */}
                {posts?.page && posts?.totalPages > 1 && (
                    <Pagination
                        page={posts.page}
                        totalPages={posts.totalPages}
                    />
                )}
            </div>
        </div>
    );
}

export const generateMetadata = async ({
    params: parametersPromise,
}: Args): Promise<Metadata> => {
    const {pageNumber} = await parametersPromise;
    const {t} = await translation();
    return {
        title: t("posts.page.metadata.title", {
            context: "paginated",
            pageNumber,
        }),
    };
};

export const generateStaticParams = async () => {
    const payload = await getPayload({config: configPromise});
    const {totalDocs} = await payload.count({
        collection: "posts",
        overrideAccess: false,
    });

    const totalPages = Math.ceil(totalDocs / 10);

    const pages: Array<{pageNumber: string}> = [];

    for (let index = 1; index <= totalPages; index++) {
        pages.push({pageNumber: String(index)});
    }

    return pages;
};
