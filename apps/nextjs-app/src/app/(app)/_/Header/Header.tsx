import type {Header as HeaderType} from "@my-project/payload";

import {HeaderClient} from "./Header.client";

import {getCachedGlobal} from "~/utils/getGlobals";

export const Header = async () => {
    const header: HeaderType = await getCachedGlobal("header", 1)();

    return <HeaderClient header={header} />;
};
