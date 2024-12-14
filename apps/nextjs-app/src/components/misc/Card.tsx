"use client";
import type {Post} from "@my-project/payload";
import {cn} from "@my-project/react-components/lib/utils";
import Link from "next/link";
import type React from "react";
import {Fragment} from "react";

import {Media} from "~/components/utils/Media";
import {useClickableCard} from "~/hooks/useClickableCard";

export type CardPostData = Pick<Post, "slug" | "categories" | "meta" | "title">;

export const Card: React.FC<{
    alignItems?: "center";
    className?: string;
    doc?: CardPostData;
    relationTo?: "posts";
    showCategories?: boolean;
    title?: string;
}> = (props) => {
    const {card, link} = useClickableCard({});
    const {
        className,
        doc,
        relationTo,
        showCategories,
        title: titleFromProps,
    } = props;

    const {slug, categories, meta, title} = doc || {};
    const {description, image: metaImage} = meta || {};

    const hasCategories =
        categories && Array.isArray(categories) && categories.length > 0;
    const titleToUse = titleFromProps || title;
    const sanitizedDescription = description?.replace(/\s/g, " "); // replace non-breaking space with white space
    const href = `/${relationTo}/${slug}`;

    return (
        <article
            ref={card.ref}
            className={cn(
                "overflow-hidden rounded-lg border border-border bg-card hover:cursor-pointer",
                className,
            )}
        >
            <div className={"relative w-full"}>
                {!metaImage && <div className={""}>No image</div>}
                {metaImage && typeof metaImage !== "string" && (
                    <Media resource={metaImage} size={"33vw"} />
                )}
            </div>
            <div className={"p-4"}>
                {showCategories && hasCategories && (
                    <div className={"mb-4 text-sm uppercase"}>
                        {showCategories && hasCategories && (
                            <div>
                                {categories?.map((category, index) => {
                                    if (typeof category === "object") {
                                        const {title: titleFromCategory} =
                                            category;

                                        const categoryTitle =
                                            titleFromCategory ||
                                            "Untitled category";

                                        const isLast =
                                            index === categories.length - 1;

                                        return (
                                            <Fragment key={index}>
                                                {categoryTitle}
                                                {!isLast && <>, &nbsp;</>}
                                            </Fragment>
                                        );
                                    }

                                    return null;
                                })}
                            </div>
                        )}
                    </div>
                )}
                {titleToUse && (
                    <div className={"prose"}>
                        <h3>
                            <Link
                                ref={link.ref}
                                className={"not-prose"}
                                href={href}
                            >
                                {titleToUse}
                            </Link>
                        </h3>
                    </div>
                )}
                {description && (
                    <div className={"mt-2"}>
                        {description && <p>{sanitizedDescription}</p>}
                    </div>
                )}
            </div>
        </article>
    );
};
