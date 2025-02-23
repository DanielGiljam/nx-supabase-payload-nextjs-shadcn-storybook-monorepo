import type {
    ArchiveBlock as ArchiveBlockProps,
    Post,
} from "@my-project/payload";
import configPromise from "@my-project/payload/config";
import {getPayload} from "payload";
import type React from "react";

import {CollectionArchive} from "~/components/misc/CollectionArchive";
import {RichText} from "~/components/utils/RichText";

export const ArchiveBlock: React.FC<
    ArchiveBlockProps & {
        id?: string;
    }
> = async (props) => {
    const {
        id,
        categories,
        introContent,
        limit: limitFromProps,
        populateBy,
        selectedDocs,
    } = props;

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/prefer-nullish-coalescing -- [bulk suppress]
    const limit = limitFromProps || 3;

    let posts: Post[] = [];

    if (populateBy === "collection") {
        const payload = await getPayload({config: configPromise});

        const flattenedCategories = categories?.map((category) =>
            typeof category === "object" ? category.id : category,
        );

        const fetchedPosts = await payload.find({
            collection: "posts",
            depth: 1,
            limit,
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
            ...(flattenedCategories && flattenedCategories.length > 0
                ? {
                      where: {
                          categories: {
                              in: flattenedCategories,
                          },
                      },
                  }
                : {}),
        });

        posts = fetchedPosts.docs;
    } else {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
        if (selectedDocs?.length) {
            // eslint-disable-next-line array-callback-return -- [bulk suppress]
            const filteredSelectedPosts = selectedDocs.map((post) => {
                if (typeof post.value === "object") return post.value;
            }) as Post[];

            posts = filteredSelectedPosts;
        }
    }

    return (
        <div className={"my-16"} id={`block-${id}`}>
            {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress] */}
            {introContent && (
                <div className={"container mb-16"}>
                    <RichText
                        className={"ml-0 max-w-[48rem]"}
                        content={introContent}
                        enableGutter={false}
                    />
                </div>
            )}
            <CollectionArchive posts={posts} />
        </div>
    );
};
