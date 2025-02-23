"use client";
import type {Post} from "@my-project/payload";
import {cn} from "@my-project/react-components/lib/utils";
import Link from "next/link";
import type React from "react";
import {useTranslation} from "react-i18next";

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
    const {t} = useTranslation();
    const {
        className,
        doc,
        relationTo,
        showCategories,
        title: titleFromProps,
    } = props;

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/prefer-nullish-coalescing -- [bulk suppress]
    const {slug, categories, meta, title} = doc || {};
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/prefer-nullish-coalescing -- [bulk suppress]
    const {description, image: metaImage} = meta || {};

    const hasCategories =
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
        categories && Array.isArray(categories) && categories.length > 0;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/prefer-nullish-coalescing -- [bulk suppress]
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
                {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress] */}
                {!metaImage && <div className={""}>No image</div>}
                {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress] */}
                {metaImage && typeof metaImage !== "string" && (
                    <Media resource={metaImage} size={"33vw"} />
                )}
            </div>
            <div className={"p-4"}>
                {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress] */}
                {showCategories && hasCategories && (
                    <div className={"mb-4 text-sm uppercase"}>
                        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- [bulk suppress] */}
                        {showCategories && hasCategories && (
                            <div>
                                {t("list", {
                                    items: categories
                                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- [bulk suppress]
                                        ?.map((category) => {
                                            if (typeof category === "object") {
                                                const {
                                                    title: titleFromCategory,
                                                } = category;

                                                const categoryTitle =
                                                    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
                                                    titleFromCategory ||
                                                    t("category.untitled");

                                                return categoryTitle;
                                            }

                                            return null;
                                        })
                                        .filter(Boolean),
                                })}
                            </div>
                        )}
                    </div>
                )}
                {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress] */}
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
                {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress] */}
                {description && (
                    <div className={"mt-2"}>
                        {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress] */}
                        {description && <p>{sanitizedDescription}</p>}
                    </div>
                )}
            </div>
        </article>
    );
};
