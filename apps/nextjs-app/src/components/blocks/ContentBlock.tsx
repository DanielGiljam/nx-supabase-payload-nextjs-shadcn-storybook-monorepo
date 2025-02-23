import type {ContentBlock as ContentBlockProps} from "@my-project/payload";
import {cn} from "@my-project/react-components/lib/utils";
import type React from "react";

import {CmsLink} from "../utils/CmsLink";

import {RichText} from "~/components/utils/RichText";

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
    const {columns} = props;

    const colsSpanClasses = {
        full: "12",
        half: "6",
        oneThird: "4",
        twoThirds: "8",
    };

    return (
        <div className={"container my-16"}>
            <div
                className={"grid grid-cols-4 gap-x-16 gap-y-8 lg:grid-cols-12"}
            >
                {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress] */}
                {columns &&
                    columns.length > 0 &&
                    columns.map((col, index) => {
                        const {enableLink, link, richText, size} = col;

                        return (
                            <div
                                key={index}
                                className={cn(
                                    `col-span-4 lg:col-span-${colsSpanClasses[size!]}`,
                                    {
                                        "md:col-span-2": size !== "full",
                                    },
                                )}
                            >
                                {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress] */}
                                {richText && (
                                    <RichText
                                        content={richText}
                                        enableGutter={false}
                                    />
                                )}

                                {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress] */}
                                {enableLink && <CmsLink {...link} />}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};
