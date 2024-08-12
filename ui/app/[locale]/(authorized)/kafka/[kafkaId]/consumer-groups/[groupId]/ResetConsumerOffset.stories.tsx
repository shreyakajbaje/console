import { Meta, StoryObj } from "@storybook/react";
import { ResetConsumerOffset } from "./ResetConsumerOffset";

export default {
  component: ResetConsumerOffset,
} as Meta<typeof ResetConsumerOffset>;

type Story = StoryObj<typeof ResetConsumerOffset>;

export const Default: Story = {
  args: {
    consumerGroupName: "console-consumer-01"
  },
};
