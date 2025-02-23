"use client";

import {Slot} from "@radix-ui/react-slot";
import React from "react";

interface MainContentMinHeightContextType {
    regionHeightsRef: React.RefObject<Record<string, number>>;
    bodyRefCallback: React.RefCallback<HTMLElement>;
    mainRefCallback: React.RefCallback<HTMLElement>;
    createRegionRefCallback: (
        regionName: string,
    ) => React.RefCallback<HTMLElement>;
}

const initialContext: MainContentMinHeightContextType = {
    regionHeightsRef: {
        current: {},
    },
    bodyRefCallback: () => {
        /* no-op */
    },
    mainRefCallback: () => {
        /* no-op */
    },
    createRegionRefCallback:
        () =>
        // eslint-disable-next-line unicorn/consistent-function-scoping
        () => {
            /* no-op */
        },
};

const MainContentMinHeightContext = React.createContext(initialContext);

const getMinHeightStyle = (regionNames: string[]) => {
    const calcExpressionTerms = ["100svh"];
    for (const name of regionNames) {
        calcExpressionTerms.push(`var(--${name}-height)`);
    }
    return `calc(${calcExpressionTerms.join(" - ")})`;
};

const Provider = ({
    children,
    initialRegionHeights = {},
}: {
    children: React.ReactNode;
    initialRegionHeights?: Record<string, number>;
}) => {
    const bodyRef = React.useRef<HTMLElement>(null);
    const bodyRefCallback = React.useCallback((body: HTMLElement | null) => {
        bodyRef.current = body;
        if (body != null) {
            for (const [name, height] of Object.entries(
                regionHeightsRef.current,
            )) {
                body.style.setProperty(`--${name}-height`, `${height}px`);
            }
        }
    }, []);
    const mainRef = React.useRef<HTMLElement>(null);
    const mainRefCallback = React.useCallback((main: HTMLElement | null) => {
        mainRef.current = main;
        if (main != null) {
            main.style.minHeight = getMinHeightStyle(
                Object.keys(regionHeightsRef.current),
            );
        }
    }, []);
    const regionHeightsRef =
        React.useRef<Record<string, number>>(initialRegionHeights);
    const createRegionRefCallback = React.useCallback(
        (regionName: string) => (section: HTMLElement | null) => {
            const height = section?.getBoundingClientRect().height ?? 0;
            regionHeightsRef.current[regionName] = height;
            if (bodyRef.current != null) {
                bodyRef.current.style.setProperty(
                    `--${regionName}-height`,
                    `${height}px`,
                );
            }
            if (mainRef.current != null) {
                mainRef.current.style.minHeight = getMinHeightStyle(
                    Object.keys(regionHeightsRef.current),
                );
            }
        },
        [],
    );
    return (
        <MainContentMinHeightContext.Provider
            value={{
                regionHeightsRef,
                bodyRefCallback,
                mainRefCallback,
                createRegionRefCallback,
            }}
        >
            {children}
        </MainContentMinHeightContext.Provider>
    );
};

const Body = ({
    asChild = false,
    children,
}: {
    asChild?: boolean;
    children: React.ReactNode;
}) => {
    const {regionHeightsRef, bodyRefCallback} = React.useContext(
        MainContentMinHeightContext,
    );
    const Comp = asChild ? Slot : "body";
    return (
        <Comp
            ref={bodyRefCallback}
            // for SSR
            style={Object.fromEntries(
                Object.entries(regionHeightsRef.current).map(
                    ([name, height]) => [`--${name}-height`, `${height}px`],
                ),
            )}
        >
            {children}
        </Comp>
    );
};

const Main = ({
    asChild = false,
    children,
}: {
    asChild?: boolean;
    children: React.ReactNode;
}) => {
    const {regionHeightsRef, mainRefCallback} = React.useContext(
        MainContentMinHeightContext,
    );
    const Comp = asChild ? Slot : "main";
    return (
        <Comp
            ref={mainRefCallback}
            // for SSR
            style={{
                minHeight: getMinHeightStyle(
                    Object.keys(regionHeightsRef.current),
                ),
            }}
        >
            {children}
        </Comp>
    );
};

const useRegionRef = (regionName: string) => {
    const {createRegionRefCallback} = React.useContext(
        MainContentMinHeightContext,
    );
    return React.useMemo(
        () => createRegionRefCallback(regionName),
        [regionName, createRegionRefCallback],
    );
};

export const MainContentMinHeight = {Provider, Body, Main, useRegionRef};
