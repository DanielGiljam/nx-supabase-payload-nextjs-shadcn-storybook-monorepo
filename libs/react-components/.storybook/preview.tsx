import type {Decorator, Parameters} from "@storybook/react";
import React from "react";
import {useDarkMode} from "storybook-dark-mode";

import "./global.css";

export const decorators: Decorator[] = [
    (Story) => {
        const darkMode = useDarkMode();
        React.useEffect(() => {
            const className = darkMode ? "dark" : "light";
            const root = globalThis.document.documentElement;
            root.classList.add(className);
            return () => {
                root.classList.remove(className);
            };
        }, [darkMode]);
        return <Story />;
    },
];

export const parameters: Parameters = {
    darkMode: {
        classTarget: "html",
        stylePreview: true,
    },
};
