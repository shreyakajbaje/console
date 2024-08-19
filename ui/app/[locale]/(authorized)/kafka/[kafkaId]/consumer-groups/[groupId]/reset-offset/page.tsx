import { getConsumerGroup } from "@/api/consumerGroups/actions";
import { KafkaConsumerGroupMembersParams } from "@/app/[locale]/(authorized)/kafka/[kafkaId]/consumer-groups/[groupId]/KafkaConsumerGroupMembers.params";
import { MembersTable } from "@/app/[locale]/(authorized)/kafka/[kafkaId]/consumer-groups/[groupId]/MembersTable";
import { KafkaParams } from "@/app/[locale]/(authorized)/kafka/[kafkaId]/kafka.params";
import { PageSection } from "@/libs/patternfly/react-core";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ResetConsumerOffset } from "./ResetConsumerOffset";

export default function ResetOffsetPage({
  params: { kafkaId, groupId },
}: {
  params: KafkaConsumerGroupMembersParams;
}) {
  return (
    <PageSection>
      <Suspense
        fallback={<MembersTable kafkaId={kafkaId} consumerGroup={undefined} />}
      >
        <ConnectedResetOffset params={{ kafkaId, groupId }} />
      </Suspense>
    </PageSection>
  );
}

async function ConnectedResetOffset({
  params: { kafkaId, groupId },
}: {
  params: KafkaParams & { groupId: string };
}) {
  async function refresh() {
    "use server";
    const res = await getConsumerGroup(kafkaId, groupId);
    return res;
  }

  const consumerGroup = await getConsumerGroup(kafkaId, groupId);
  if (!consumerGroup) {
    notFound();
  }

  const topics = consumerGroup.attributes.members
    ?.flatMap((m) =>
      m.assignments?.map((topic) => topic.topicName)
    )
    .filter(
      (topicName): topicName is string => topicName !== undefined
    ) || []

  const partitions = consumerGroup.attributes.members
    ?.flatMap((m) =>
      m.assignments?.map((topic) => topic.partition)
    ).filter(
      (partition): partition is number => partition !== undefined
    ) || []
  return <ResetConsumerOffset
    consumerGroupName={consumerGroup.id}
    topics={topics}
    partitions={partitions} />;
}
