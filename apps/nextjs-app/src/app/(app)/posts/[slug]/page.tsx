import type {Post} from "@my-project/payload";
import configPromise from "@my-project/payload/config";
import type {Metadata} from "next";
import {draftMode} from "next/headers";
import {getPayload} from "payload";
import React from "react";

import PageClient from "./page.client";

import {PostHero} from "~/components/heros/PostHero";
import {RelatedPosts} from "~/components/misc/RelatedPosts";
import {PayloadRedirects} from "~/components/utils/PayloadRedirects";
import {RichText} from "~/components/utils/RichText";
import {generateMeta} from "~/utils/generateMeta";

export const generateStaticParams = async () => {
    const payload = await getPayload({config: configPromise});
    const posts = await payload.find({
        collection: "posts",
        draft: false,
        limit: 1000,
        overrideAccess: false,
        select: {
            slug: true,
        },
    });

    const parameters = posts.docs.map(({slug}) => ({slug}));

    return parameters;
};

interface Args {
    params: Promise<{
        slug?: string;
    }>;
}

export default async function Post({params: parametersPromise}: Args) {
    const {slug = ""} = await parametersPromise;
    const url = "/posts/" + slug;
    const post = await queryPostBySlug({slug});

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
    if (!post) return <PayloadRedirects url={url} />;

    return (
        <article className={"pb-16 pt-16"}>
            <PageClient />

            {/* Allows redirects for valid pages too */}
            <PayloadRedirects url={url} disableNotFound />

            <PostHero post={post} />

            <div className={"flex flex-col items-center gap-4 pt-8"}>
                <div className={"container"}>
                    <RichText
                        className={"mx-auto max-w-[48rem]"}
                        content={post.content}
                        enableGutter={false}
                    />
                    {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress] */}
                    {post.relatedPosts && post.relatedPosts.length > 0 && (
                        <RelatedPosts
                            className={
                                "col-span-3 col-start-1 mt-12 max-w-[52rem] grid-rows-[2fr] lg:grid lg:grid-cols-subgrid"
                            }
                            docs={post.relatedPosts.filter(
                                (post) => typeof post === "object",
                            )}
                        />
                    )}
                </div>
            </div>
        </article>
    );
}

export const generateMetadata = async ({
    params: parametersPromise,
}: Args): Promise<Metadata> => {
    const {slug = ""} = await parametersPromise;
    const post = await queryPostBySlug({slug});

    return await generateMeta({doc: post});
};

const queryPostBySlug = React.cache(async ({slug}: {slug: string}) => {
    const {isEnabled: draft} = await draftMode();

    const payload = await getPayload({config: configPromise});

    const result = await payload.find({
        collection: "posts",
        draft,
        limit: 1,
        overrideAccess: draft,
        pagination: false,
        where: {
            slug: {
                equals: slug,
            },
        },
    });

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
    return result.docs?.[0] || null;
});
