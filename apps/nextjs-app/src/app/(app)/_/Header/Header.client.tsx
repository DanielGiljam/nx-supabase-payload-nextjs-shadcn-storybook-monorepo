"use client";
import type {Header} from "@my-project/payload";
import Link from "next/link";
import {usePathname} from "next/navigation";
import React from "react";

import {HeaderNav} from "./Nav";

import {Logo} from "~/components/misc/Logo";
import {useHeaderTheme} from "~/theme/header/useHeaderTheme";

interface HeaderClientProps {
    header: Header;
}

export const HeaderClient: React.FC<HeaderClientProps> = ({header}) => {
    /* Storing the value in a useState to avoid hydration errors */
    const [theme, setTheme] = React.useState<string | null>(null);
    const {headerTheme, setHeaderTheme} = useHeaderTheme();
    const pathname = usePathname();

    React.useEffect(() => {
        setHeaderTheme(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    React.useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
        if (headerTheme && headerTheme !== theme) setTheme(headerTheme);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headerTheme]);

    return (
        <header
            className={"container relative z-20"}
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
            {...(theme ? {"data-theme": theme} : {})}
        >
            <div className={"flex justify-between border-b border-border py-8"}>
                <Link href={"/"}>
                    <Logo
                        className={"invert dark:invert-0"}
                        loading={"eager"}
                        priority={"high"}
                    />
                </Link>
                <HeaderNav header={header} />
            </div>
        </header>
    );
};
