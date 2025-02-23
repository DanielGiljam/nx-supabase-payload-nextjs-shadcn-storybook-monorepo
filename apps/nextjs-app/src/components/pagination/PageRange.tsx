import type React from "react";

import {translation} from "~/i18n/server";

export const PageRange: React.FC<{
    className?: string;
    collection?: string;
    currentPage?: number;
    limit?: number;
    totalDocs?: number;
}> = async (props) => {
    const {t} = await translation();
    const {className, collection, currentPage, limit, totalDocs} = props;

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/prefer-nullish-coalescing -- [bulk suppress]
    let indexStart = (currentPage ? currentPage - 1 : 1) * (limit || 1) + 1;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
    if (totalDocs && indexStart > totalDocs) indexStart = 0;

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/prefer-nullish-coalescing -- [bulk suppress]
    let indexEnd = (currentPage || 1) * (limit || 1);
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
    if (totalDocs && indexEnd > totalDocs) indexEnd = totalDocs;

    return (
        <div className={[className, "font-semibold"].filter(Boolean).join(" ")}>
            {(totalDocs === undefined || totalDocs === 0) &&
                t("pagination.pageRange.noResults")}
            {totalDocs !== undefined &&
                totalDocs > 0 &&
                t("pagination.pageRange.showing", {
                    context: indexStart > 0 ? "range" : undefined,
                    collection,
                    indexStart,
                    indexEnd,
                    totalDocs,
                })}
        </div>
    );
};
