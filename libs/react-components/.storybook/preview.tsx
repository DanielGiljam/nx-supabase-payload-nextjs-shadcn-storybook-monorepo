import type {Decorator, Parameters} from "@storybook/react";
import localFont from "next/font/local";
import React from "react";
import {useDarkMode} from "storybook-dark-mode";

import "./global.css";

const GeistSans = localFont({
    src: "./fonts/Geist-Variable.woff2",
    variable: "--font-geist-sans",
});

const GeistMono = localFont({
    src: "./fonts/GeistMono-Variable.woff2",
    variable: "--font-geist-mono",
});

export const decorators: Decorator[] = [
    (Story) => {
        const darkMode = useDarkMode();
        React.useEffect(() => {
            const className = darkMode ? "dark" : "light";
            const root = globalThis.document.documentElement;
            root.dataset.theme = className;
            return () => {
                delete root.dataset.theme;
            };
        }, [darkMode]);
        return <Story />;
    },
    (Story) => {
        React.useEffect(() => {
            const root = globalThis.document.documentElement;
            root.classList.add(GeistSans.variable, GeistMono.variable);
        }, []);
        return <Story />;
    },
];

export const parameters: Parameters = {
    darkMode: {
        classTarget: "html",
        stylePreview: true,
    },
};

export const tags = ["autodocs"];
