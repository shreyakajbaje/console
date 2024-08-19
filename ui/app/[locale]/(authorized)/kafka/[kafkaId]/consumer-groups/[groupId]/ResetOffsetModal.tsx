import { ConsumerGroup } from "@/api/consumerGroups/schema";
import { ExternalLink } from "@/components/Navigation/ExternalLink";
import { Button, List, ListItem, Modal, ModalVariant, Stack, StackItem, Text } from "@/libs/patternfly/react-core";
import { useTranslations } from "next-intl";

export function ResetOffsetModal({
  members,
  isResetOffsetModalOpen,
  onClickClose,
  refresh

}: {
  members: string[];
  isResetOffsetModalOpen: boolean;
  onClickClose: () => void;
  refresh: (() => Promise<ConsumerGroup[]>) | undefined;
}) {

  const t = useTranslations("ConsumerGroupsTable");

  return (
    <Modal
      title={t("consumer_group_must_be_empty")}
      titleIconVariant="warning"
      isOpen={isResetOffsetModalOpen}
      variant={ModalVariant.medium}
      description={t("consumer_group_must_be_empty_description")}
      onClose={onClickClose}
      actions={[
        <Button key="close" variant="primary" onClick={onClickClose}>
          {t("close")}
        </Button>,
        <Button key="refresh" variant="secondary" onClick={refresh}>
          {t("refresh")}
        </Button>,
        <Button key="refresh" variant="link" onClick={onClickClose}>
          {t("cancel")}
        </Button>
      ]}>
      <Stack hasGutter>
        <StackItem>
          <Text>{t("member_list_to_shutdown")}</Text>
        </StackItem>
        <StackItem>
          <List>
            {members.map((member, index) => (
              <ListItem key={index}>{member}</ListItem>
            ))}
          </List>
        </StackItem>
        <StackItem>
          <ExternalLink
            testId={"learn_to_shutdown_members"}
            href={""}
          >
            {t("learn_to_shutdown_members")}
          </ExternalLink>
        </StackItem>
      </Stack>
    </Modal>
  )
}
