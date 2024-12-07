import {expect} from "@storybook/jest";
import type {Meta, StoryObj} from "@storybook/react";
import {within} from "@storybook/testing-library";

import {Button} from "./button";

const meta: Meta<typeof Button> = {
    component: Button,
    title: "Button",
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        children: "Primary",
    },
    play: async ({canvasElement}) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText(/Primary/)).toBeTruthy();
    },
};
