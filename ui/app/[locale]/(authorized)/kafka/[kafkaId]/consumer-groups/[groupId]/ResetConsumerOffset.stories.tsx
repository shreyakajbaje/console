import { Meta, StoryObj } from "@storybook/react";
import { ResetConsumerOffset } from "./ResetConsumerOffset";

export default {
  component: ResetConsumerOffset,
} as Meta<typeof ResetConsumerOffset>;

type Story = StoryObj<typeof ResetConsumerOffset>;

export const Default: Story = {
  args: {
    consumerGroupName: "console-consumer-01",
    topics: ["console_datagen_002-a", "console_datagen_002-b", "console_datagen_002-c", "console_datagen_002-d"],
    partitions: ["1", "2", "3"]
  },
};
