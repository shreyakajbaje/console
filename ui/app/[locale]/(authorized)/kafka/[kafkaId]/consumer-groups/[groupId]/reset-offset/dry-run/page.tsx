import { getConsumerGroup } from "@/api/consumerGroups/actions";
import { KafkaConsumerGroupMembersParams } from "@/app/[locale]/(authorized)/kafka/[kafkaId]/consumer-groups/[groupId]/KafkaConsumerGroupMembers.params";
import { MembersTable } from "@/app/[locale]/(authorized)/kafka/[kafkaId]/consumer-groups/[groupId]/MembersTable";
import { KafkaParams } from "@/app/[locale]/(authorized)/kafka/[kafkaId]/kafka.params";
import { PageSection } from "@/libs/patternfly/react-core";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Dryrun } from "./Dryrun";

export default function DryRunPage({
  params: { kafkaId, groupId },
}: {
  params: KafkaConsumerGroupMembersParams;
}) {
  return (
    <PageSection>
      <Suspense
        fallback={<MembersTable kafkaId={kafkaId} consumerGroup={undefined} />}
      >
        <ConnectedDryrun params={{ kafkaId, groupId }} />
      </Suspense>
    </PageSection>
  );
}

async function ConnectedDryrun({
  params: { kafkaId, groupId },
}: {
  params: KafkaParams & { groupId: string };
}) {
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
  return <Dryrun
    consumerGroupName={consumerGroup.id} topics={[]} baseurl={`/kafka/${kafkaId}/consumer-groups/${consumerGroup.id}/reset-offset`} />;
}
