"use client";

import {cn} from "@my-project/react-components/lib/utils";
import {getClientSideUrl} from "@my-project/utils";
import {useRouter, useSelectedLayoutSegments} from "next/navigation";
import type {PayloadAdminBarProps, PayloadMeUser} from "payload-admin-bar";
import {PayloadAdminBar} from "payload-admin-bar";
import React from "react";

import {useSupabaseAuth} from "~/supabase/useSupabaseAuth";

import "./index.scss";

const baseClass = "admin-bar";

const collectionLabels: Record<
    string,
    | {
          plural: string;
          singular: string;
      }
    | undefined
> = {
    pages: {
        plural: "Pages",
        singular: "Page",
    },
    posts: {
        plural: "Posts",
        singular: "Post",
    },
    projects: {
        plural: "Projects",
        singular: "Project",
    },
};

const Title: React.FC = () => <span>Dashboard</span>;

export const AdminBar: React.FC<{
    adminBarProps?: PayloadAdminBarProps;
}> = (props) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
    const {adminBarProps} = props || {};
    const segments = useSelectedLayoutSegments();
    const [show, setShow] = React.useState(false);
    const collection =
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- [bulk suppress]
        collectionLabels[segments?.[1]] == null
            ? "pages"
            : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- [bulk suppress]
              segments?.[1];
    const router = useRouter();

    const onAuthChange = React.useCallback((user: PayloadMeUser) => {
        setShow(user?.id as never);
    }, []);

    const {session} = useSupabaseAuth();

    return (
        <div
            className={cn(baseClass, "bg-black py-2 text-white", {
                block: show,
                hidden: !show,
            })}
        >
            <div className={"container"}>
                <PayloadAdminBar
                    {...adminBarProps}
                    key={(session == null).toString()}
                    className={"py-2 text-white"}
                    classNames={{
                        controls: "font-medium text-white",
                        logo: "text-white",
                        user: "text-white",
                    }}
                    cmsURL={getClientSideUrl()}
                    collection={collection}
                    collectionLabels={{
                        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/prefer-nullish-coalescing -- [bulk suppress]
                        plural: collectionLabels[collection]?.plural || "Pages",

                        singular:
                            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/prefer-nullish-coalescing -- [bulk suppress]
                            collectionLabels[collection]?.singular || "Page",
                    }}
                    logo={<Title />}
                    style={{
                        backgroundColor: "transparent",
                        padding: 0,
                        position: "relative",
                        zIndex: "unset",
                    }}
                    onAuthChange={onAuthChange}
                    onPreviewExit={() => {
                        void fetch("/next/exit-preview").then(() => {
                            router.push("/");
                            router.refresh();
                        });
                    }}
                />
            </div>
        </div>
    );
};
