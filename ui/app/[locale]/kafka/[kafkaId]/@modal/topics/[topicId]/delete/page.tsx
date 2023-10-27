import { deleteTopic, getTopic } from "@/api/topics";
import { DeleteTopicModal } from "@/app/[locale]/kafka/[kafkaId]/@modal/topics/[topicId]/delete/DeleteTopicModal";
import { KafkaTopicParams } from "@/app/[locale]/kafka/[kafkaId]/topics/kafkaTopic.params";
import { revalidateTag } from "next/cache";

export default async function DeletePage({
  params: { kafkaId, topicId },
}: {
  params: KafkaTopicParams;
}) {
  const topic = await getTopic(kafkaId, topicId);

  async function onDelete() {
    "use server";
    const res = await deleteTopic(kafkaId, topicId);
    if (res) {
      revalidateTag("topics");
    }
    return res;
  }

  return (
    <DeleteTopicModal topicName={topic.attributes.name} onDelete={onDelete} />
  );
}
