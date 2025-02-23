import acceptLanguageParser from "accept-language-parser";
import {type KeyPrefix, createInstance} from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import {cookies as cookies_, headers as headers_} from "next/headers";
import React from "react";
import type {FallbackNs, UseTranslationOptions} from "react-i18next";
import {initReactI18next} from "react-i18next/initReactI18next";

import {cookieName, fallbackLng, getOptions, languages} from "./options";

export const language = React.cache(async () => {
    const cookies = await cookies_();
    const headers = await headers_();
    let lng;
    if (cookies.has(cookieName))
        lng = acceptLanguageParser.pick(
            languages,
            cookies.get(cookieName)!.value,
        );
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!lng)
        lng = acceptLanguageParser.pick(
            languages,
            headers.get("Accept-Language") ?? "",
        );
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!lng) lng = fallbackLng;
    return lng;
});

const initI18next = React.cache(
    async (lng: string, ns: string | readonly string[] | undefined) => {
        const i18nInstance = createInstance();
        await i18nInstance
            .use(initReactI18next)
            .use(
                resourcesToBackend(
                    // eslint-disable-next-line @typescript-eslint/promise-function-async
                    (language: string, namespace: string) =>
                        import(`./locales/${language}/${namespace}.json`),
                ),
            )
            .init(getOptions(lng, ns));
        return i18nInstance;
    },
);

/**
 * `useTranslation` but for server components.
 */
export const translation = async <
    Ns extends string | readonly string[] | undefined = undefined,
    KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(
    ns?: Ns,
    options: UseTranslationOptions<KPrefix> = {},
) => {
    const lng = await language();
    const i18nextInstance = await initI18next(lng, ns);
    return {
        t: i18nextInstance.getFixedT(
            lng,
            Array.isArray(ns) ? ns[0] : ns,
            options.keyPrefix,
        ),
        i18n: i18nextInstance,
    };
};
