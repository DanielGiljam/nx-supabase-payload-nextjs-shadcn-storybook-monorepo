import configPromise from "@my-project/payload/config";
import type {Metadata} from "next/types";
import {getPayload} from "payload";

import {SearchInput} from "./_/SearchInput";
import PageClient from "./page.client";

import type {CardPostData} from "~/components/misc/Card";
import {CollectionArchive} from "~/components/misc/CollectionArchive";
import {translation} from "~/i18n/server";

interface Args {
    searchParams: Promise<{
        q: string;
    }>;
}
export default async function Page({
    searchParams: searchParametersPromise,
}: Args) {
    const {q: query} = await searchParametersPromise;
    const payload = await getPayload({config: configPromise});
    const {t} = await translation();

    const posts = await payload.find({
        collection: "search",
        depth: 1,
        limit: 12,
        select: {
            title: true,
            slug: true,
            categories: true,
            meta: true,
        },
        // pagination: false reduces overhead if you don't need totalDocs
        pagination: false,
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
        ...(query
            ? {
                  where: {
                      or: [
                          {
                              title: {
                                  like: query,
                              },
                          },
                          {
                              "meta.description": {
                                  like: query,
                              },
                          },
                          {
                              "meta.title": {
                                  like: query,
                              },
                          },
                          {
                              slug: {
                                  like: query,
                              },
                          },
                      ],
                  },
              }
            : {}),
    });

    return (
        <div className={"pb-24 pt-24"}>
            <PageClient />
            <div className={"container mb-16"}>
                <div className={"prose max-w-none dark:prose-invert"}>
                    <h1 className={"sr-only"}>{t("search.label")}</h1>
                    <SearchInput />
                </div>
            </div>

            {posts.totalDocs > 0 ? (
                <CollectionArchive posts={posts.docs as CardPostData[]} />
            ) : (
                <div className={"container"}>{t("search.noResults")}</div>
            )}
        </div>
    );
}

export const generateMetadata = async (): Promise<Metadata> => {
    const {t} = await translation();
    return {
        title: t("search.page.metadata.title"),
    };
};
