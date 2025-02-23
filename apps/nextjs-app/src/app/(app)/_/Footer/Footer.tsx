import type {Footer as FooterType} from "@my-project/payload";

import {FooterClient} from "./Footer.client";

import {getCachedGlobal} from "~/utils/getGlobals";

export const Footer = async () => {
    const footer: FooterType = await getCachedGlobal("footer", 1)();

    return <FooterClient footer={footer} />;
};
