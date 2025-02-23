"use client";
import {useRouter} from "next/navigation";
import React from "react";

interface UseClickableCardType<T extends HTMLElement> {
    card: {
        ref: React.RefObject<T | null>;
    };
    link: {
        ref: React.RefObject<HTMLAnchorElement | null>;
    };
}

interface Props {
    external?: boolean;
    newTab?: boolean;
    scroll?: boolean;
}

export const useClickableCard = <T extends HTMLElement>({
    external = false,
    newTab = false,
    scroll = true,
}: Props): UseClickableCardType<T> => {
    const router = useRouter();
    const card = React.useRef<T>(null);
    const link = React.useRef<HTMLAnchorElement>(null);
    const timeDown = React.useRef<number>(0);
    const hasActiveParent = React.useRef<boolean>(false);
    const pressedButton = React.useRef<number>(0);

    const handleMouseDown = React.useCallback(
        (event: MouseEvent) => {
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
            if (event.target) {
                const target = event.target as Element;

                const timeNow = Date.now();
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- [bulk suppress]
                const parent = target?.closest("a");

                pressedButton.current = event.button;

                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
                if (parent) {
                    hasActiveParent.current = true;
                } else {
                    hasActiveParent.current = false;
                    timeDown.current = timeNow;
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [router, card, link, timeDown],
    );

    const handleMouseUp = React.useCallback(
        (event: MouseEvent) => {
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
            if (link.current?.href) {
                const timeNow = Date.now();
                const difference = timeNow - timeDown.current;

                if (
                    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition -- [bulk suppress]
                    link.current?.href &&
                    difference <= 250 &&
                    !hasActiveParent.current &&
                    pressedButton.current === 0 &&
                    !event.ctrlKey
                ) {
                    if (external) {
                        const target = newTab ? "_blank" : "_self";
                        window.open(link.current.href, target);
                    } else {
                        router.push(link.current.href, {scroll});
                    }
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [router, card, link, timeDown],
    );

    React.useEffect(() => {
        const cardNode = card.current;

        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
        if (cardNode) {
            cardNode.addEventListener("mousedown", handleMouseDown);
            cardNode.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition -- [bulk suppress]
            if (cardNode && cardNode) {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- [bulk suppress]
                cardNode?.removeEventListener("mousedown", handleMouseDown);
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- [bulk suppress]
                cardNode?.removeEventListener("mouseup", handleMouseUp);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [card, link, router]);

    return {
        card: {
            ref: card,
        },
        link: {
            ref: link,
        },
    };
};
