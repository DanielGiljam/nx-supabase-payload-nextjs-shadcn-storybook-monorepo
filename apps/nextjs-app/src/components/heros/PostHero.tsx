import type {Post} from "@my-project/payload";
import React from "react";

import {Media} from "~/components/utils/Media";
import {formatDateTime} from "~/utils/formatDateTime";

export const PostHero: React.FC<{
    post: Post;
}> = ({post}) => {
    const {
        categories,
        meta: {image: metaImage} = {},
        populatedAuthors,
        publishedAt,
        title,
    } = post;

    return (
        <div className={"relative -mt-[10.4rem] flex items-end"}>
            <div
                className={
                    "container relative z-10 pb-8 text-white lg:grid lg:grid-cols-[1fr_48rem_1fr]"
                }
            >
                <div
                    className={
                        "col-span-1 col-start-1 md:col-span-2 md:col-start-2"
                    }
                >
                    <div className={"mb-6 text-sm uppercase"}>
                        {categories?.map((category, index) => {
                            if (
                                typeof category === "object" &&
                                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- [bulk suppress]
                                category !== null
                            ) {
                                const {title: categoryTitle} = category;

                                const titleToUse =
                                    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
                                    categoryTitle || "Untitled category";

                                // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- [bulk suppress]
                                const isLast = index === categories.length - 1;

                                return (
                                    <React.Fragment key={index}>
                                        {titleToUse}
                                        {!isLast && <>, &nbsp;</>}
                                    </React.Fragment>
                                );
                            }
                            return null;
                        })}
                    </div>

                    <div className={""}>
                        <h1 className={"mb-6 text-3xl md:text-5xl lg:text-6xl"}>
                            {title}
                        </h1>
                    </div>

                    <div
                        className={"flex flex-col gap-4 md:flex-row md:gap-16"}
                    >
                        <div className={"flex flex-col gap-4"}>
                            {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress] */}
                            {populatedAuthors && (
                                <div className={"flex flex-col gap-1"}>
                                    <p className={"text-sm"}>Author</p>
                                    {populatedAuthors.map((author, index) => {
                                        const {name} = author;

                                        const isLast =
                                            index ===
                                            // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- [bulk suppress]
                                            populatedAuthors.length - 1;
                                        const secondToLast =
                                            index ===
                                            // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- [bulk suppress]
                                            populatedAuthors.length - 2;

                                        return (
                                            <React.Fragment key={index}>
                                                {name}
                                                {secondToLast &&
                                                    populatedAuthors.length >
                                                        // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- [bulk suppress]
                                                        2 && <>, </>}
                                                {secondToLast &&
                                                    populatedAuthors.length ===
                                                        // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- [bulk suppress]
                                                        2 && <> </>}
                                                {!isLast &&
                                                    populatedAuthors.length >
                                                        // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- [bulk suppress]
                                                        1 && <>and </>}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress] */}
                        {publishedAt && (
                            <div className={"flex flex-col gap-1"}>
                                <p className={"text-sm"}>Date Published</p>

                                <time dateTime={publishedAt}>
                                    {formatDateTime(publishedAt)}
                                </time>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={"min-h-[80vh] select-none"}>
                {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress] */}
                {metaImage && typeof metaImage !== "string" && (
                    <Media
                        imgClassName={"-z-10 object-cover"}
                        loading={"lazy"}
                        priority={false}
                        resource={metaImage}
                        fill
                    />
                )}
                <div
                    className={
                        "pointer-events-none absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-black to-transparent"
                    }
                />
            </div>
        </div>
    );
};
