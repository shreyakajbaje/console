import { Meta, StoryObj } from "@storybook/react";
import { Dryrun } from "./Dryrun";

export default {
  component: Dryrun,
  args: {}
} as Meta<typeof Dryrun>;

type Story = StoryObj<typeof Dryrun>;

const sampleTopics = [
  { topicName: "Topic A", partition: 0, offset: 1234 },
  { topicName: "Topic A", partition: 1, offset: 5678 },
  { topicName: "Topic B", partition: 0, offset: 91011 },
  { topicName: "Topic C", partition: 2, offset: 121314 },
  { topicName: "Topic C", partition: 1, offset: 221222 },
  { topicName: "Topic B", partition: 1, offset: 2341233 },
  { topicName: "Topic B", partition: 1, offset: 675 },
  { topicName: "Topic A", partition: 2, offset: 765 },
];



export const Default: Story = {
  args: {
    consumerGroupName: "console_datagen_002-a",
    topics: sampleTopics

  },
};
