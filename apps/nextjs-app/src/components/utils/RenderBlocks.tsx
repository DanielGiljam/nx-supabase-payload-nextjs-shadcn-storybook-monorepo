import type {Page} from "@my-project/payload";
import type React from "react";

import {ArchiveBlock} from "~/components/blocks/ArchiveBlock";
import {CallToActionBlock} from "~/components/blocks/CallToActionBlock";
import {ContentBlock} from "~/components/blocks/ContentBlock";
import {FormBlock} from "~/components/blocks/FormBlock";
import {MediaBlock} from "~/components/blocks/MediaBlock";

const blockComponents = {
    archive: ArchiveBlock,
    content: ContentBlock,
    cta: CallToActionBlock,
    formBlock: FormBlock,
    mediaBlock: MediaBlock,
};

export const RenderBlocks: React.FC<{
    blocks: Array<Page["layout"][0]>;
}> = (props) => {
    const {blocks} = props;

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition -- [bulk suppress]
    const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

    if (hasBlocks) {
        return (
            <>
                {blocks.map((block, index) => {
                    const {blockType} = block;

                    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition -- [bulk suppress]
                    if (blockType && blockType in blockComponents) {
                        const Block = blockComponents[blockType];

                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
                        if (Block) {
                            return (
                                <div key={index} className={"my-16"}>
                                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment -- [bulk suppress] */}
                                    {/* @ts-expect-error */}
                                    <Block {...block} />
                                </div>
                            );
                        }
                    }
                    return null;
                })}
            </>
        );
    }

    return null;
};
