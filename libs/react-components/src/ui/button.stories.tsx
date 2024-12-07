import {expect} from "@storybook/jest";
import type {Meta, StoryObj} from "@storybook/react";
import {within} from "@storybook/testing-library";

import {Button} from "./button";

const meta: Meta<typeof Button> = {
    component: Button,
    title: "Button",
    argTypes: {
        variant: {
            control: "inline-radio",
            options: [
                "default",
                "destructive",
                "outline",
                "secondary",
                "ghost",
                "link",
            ],
        },
        size: {
            control: "inline-radio",
            options: ["default", "sm", "lg", "icon"],
        },
    },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: {
        children: "Default",
        variant: "default",
        size: "default",
    },
    play: async ({canvasElement}) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText(/Default/)).toBeTruthy();
    },
};
