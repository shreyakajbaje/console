import { Meta, StoryObj } from "@storybook/react";
import { Dryrun } from "./Dryrun";

export default {
  component: Dryrun,
  args: {}
} as Meta<typeof Dryrun>;

type Story = StoryObj<typeof Dryrun>;

const topicsData = [
  {
    topicName: 'console-datagen-0',
    topicId: '1',
    partitions: [
      { partition: "partition 0", offset: 750 },
      { partition: "partition 1", offset: 657 },
      { partition: "partition 2", offset: 876 },
    ],
  },
  {
    topicName: 'my-topic-3',
    topicId: '2',
    partitions: [
      { partition: "partition 0", offset: 750 },
      { partition: "partition 1", offset: 657 },
      { partition: "partition 2", offset: 876 },
    ],
  },
  {
    topicName: 'my-topic-4',
    topicId: '3',
    partitions: [
      { partition: "partition 0", offset: 750 },
      { partition: "partition 1", offset: 657 },
      { partition: "partition 2", offset: 876 },
    ],
  },
  {
    topicName: 'my-topic-5',
    topicId: '4',
    partitions: [
      { partition: "partition 0", offset: 750 },
      { partition: "partition 1", offset: 657 },
      { partition: "partition 2", offset: 876 },
    ],
  },
];


export const Default: Story = {
  args: {
    consumerGroupName: "console_datagen_002-a",
    topics: topicsData
  },
};
