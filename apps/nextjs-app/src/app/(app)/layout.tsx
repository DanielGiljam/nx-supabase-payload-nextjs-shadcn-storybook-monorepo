import {cn} from "@my-project/react-components/lib/utils";
import {getServerSideUrl} from "@my-project/utils";
import {GeistMono} from "geist/font/mono";
import {GeistSans} from "geist/font/sans";
import {dir} from "i18next";
import type {Metadata} from "next";
import type React from "react";

import {Body} from "./_/Body";
import {Footer} from "./_/Footer";
import {Header} from "./_/Header";
import {LivePreviewListener} from "./_/LivePreviewListener";
import {Main} from "./_/Main";
import {QueryClientProvider} from "./_/QueryClientProvider";

import {GsiClient} from "~/components/auth/GsiClient";
import {InitI18nClient} from "~/i18n/client";
import {language} from "~/i18n/server";
import {SupabaseAuthProvider} from "~/supabase/SupabaseAuthProvider";
import {InitTheme} from "~/theme/InitTheme";
import {ThemeProvider} from "~/theme/ThemeProvider";
import {HeaderThemeProvider} from "~/theme/header/HeaderThemeProvider";
import {mergeOpenGraph} from "~/utils/mergeOpenGraph";

import "./global.css";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const lng = await language();

    return (
        <html
            className={cn(GeistSans.variable, GeistMono.variable)}
            dir={dir(lng)}
            lang={lng}
            suppressHydrationWarning
        >
            <head>
                <InitTheme />
                <InitI18nClient lng={lng} />
                <link href={"/favicon.ico"} rel={"icon"} sizes={"32x32"} />
                <link
                    href={"/favicon.svg"}
                    rel={"icon"}
                    type={"image/svg+xml"}
                />
            </head>
            <Body>
                <ThemeProvider>
                    <HeaderThemeProvider>
                        <SupabaseAuthProvider>
                            <QueryClientProvider>
                                <GsiClient />
                                <LivePreviewListener />

                                <Header />
                                <Main>{children}</Main>
                                <Footer />
                            </QueryClientProvider>
                        </SupabaseAuthProvider>
                    </HeaderThemeProvider>
                </ThemeProvider>
            </Body>
        </html>
    );
}

export const metadata: Metadata = {
    metadataBase: new URL(getServerSideUrl()),
    openGraph: mergeOpenGraph(),
    twitter: {
        card: "summary_large_image",
        creator: "@payloadcms",
    },
};
