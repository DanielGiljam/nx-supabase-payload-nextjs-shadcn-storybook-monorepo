"use client";
import {Highlight, themes} from "prism-react-renderer";
import type React from "react";

import {CopyButton} from "./CopyButton";

interface Props {
    code: string;
    language?: string;
}

export const CodeBlockClient: React.FC<Props> = ({code, language = ""}) => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
    if (!code) return null;

    return (
        <Highlight code={code} language={language} theme={themes.vsDark}>
            {({getLineProps, getTokenProps, tokens}) => (
                <pre
                    className={
                        "overflow-x-auto rounded border border-border bg-black p-4 text-xs"
                    }
                >
                    {tokens.map((line, index) => (
                        <div
                            key={index}
                            {...getLineProps({className: "table-row", line})}
                        >
                            <span
                                className={
                                    "table-cell select-none text-right text-white/25"
                                }
                            >
                                {index + 1}
                            </span>
                            <span className={"table-cell pl-4"}>
                                {line.map((token, key) => (
                                    <span
                                        key={key}
                                        {...getTokenProps({token})}
                                    />
                                ))}
                            </span>
                        </div>
                    ))}
                    <CopyButton code={code} />
                </pre>
            )}
        </Highlight>
    );
};
