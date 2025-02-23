"use client";
import {Button} from "@my-project/react-components/ui/button";
import {CopyIcon} from "@payloadcms/ui/icons/Copy";
import React from "react";
import {useTranslation} from "react-i18next";

export const CopyButton = ({code}: {code: string}) => {
    const {t} = useTranslation();
    const [copied, setCopied] = React.useState(false);

    const updateCopyStatus = () => {
        if (!copied) {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 1000);
        }
    };

    return (
        <div className={"flex justify-end align-middle"}>
            <Button
                className={"flex gap-1"}
                variant={"secondary"}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises -- [bulk suppress]
                onClick={async () => {
                    await navigator.clipboard.writeText(code);
                    updateCopyStatus();
                }}
            >
                <p>
                    {t("copyButton.label", {
                        context: copied ? "copied" : undefined,
                    })}
                </p>

                <div className={"h-6 w-6 dark:invert"}>
                    <CopyIcon />
                </div>
            </Button>
        </div>
    );
};
