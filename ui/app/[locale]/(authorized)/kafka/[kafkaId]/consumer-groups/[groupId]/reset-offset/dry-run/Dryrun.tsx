"use client";

import { Alert, Button, Card, DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm, Divider, Flex, FlexItem, JumpLinks, JumpLinksItem, List, ListItem, Panel, PanelHeader, PanelMain, PanelMainBody, Sidebar, SidebarContent, SidebarPanel, Stack, StackItem } from "@patternfly/react-core";
import { TextContent, Text, TextVariants } from "@/libs/patternfly/react-core";
import { useTranslations } from "next-intl";
import { DownloadIcon } from "@/libs/patternfly/react-icons";

type PartitionOffset = {
  partition: string;
  offset: number;
};

type TopicDetails = {
  topicName: string;
  topicId: string;
  partitions: PartitionOffset[];
};


export function Dryrun({
  consumerGroupName,
  topics,

}: {
  consumerGroupName: string;
  topics: TopicDetails[];
}) {
  const t = useTranslations("ConsumerGroupsTable");

  return (
    <Panel>
      <PanelHeader>
        <Flex>
          <FlexItem>
            <TextContent>
              <Text>{t.rich("dry_run_result")}</Text>
            </TextContent>
          </FlexItem>
          <FlexItem>
            <Button variant="link">
              {<>{t("download_dryrun_result")}{" "}< DownloadIcon />
              </>}
            </Button>
          </FlexItem>
        </Flex>
        <TextContent>
          <Text>{t.rich("consumer_name", { consumerGroupName })}</Text>
        </TextContent>
      </PanelHeader>
      <Divider />
      <PanelMain>
        <PanelMainBody>
          <Stack hasGutter>
            <StackItem>
              <Sidebar>
                <SidebarPanel>
                  <JumpLinks isVertical
                    label={t.rich("jump_to_topic")}>
                    {topics.map((topic) => (
                      <JumpLinksItem key={topic.topicId}
                        href={`#topic-${topic.topicId}`}>
                        {topic.topicName}
                      </JumpLinksItem>
                    ))}
                  </JumpLinks>
                </SidebarPanel>
                <SidebarContent>
                  {topics.map((topic) => (
                    <DescriptionList key={topic.topicId} id={`topic-${topic.topicId}`}>
                      <DescriptionListGroup>
                        <DescriptionListTerm>{t("topic")}</DescriptionListTerm>
                        <DescriptionListDescription>{topic.topicName}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>{t("partition")}</DescriptionListTerm>
                        <DescriptionListDescription>
                          <List isPlain>
                            {topic.partitions.map(partition => (
                              <ListItem key={partition.partition}>{partition.partition}</ListItem>
                            ))}
                          </List>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>{t("new_offset")}</DescriptionListTerm>
                        <DescriptionListDescription>
                          <List isPlain>
                            {topic.partitions.map(partition => (
                              <ListItem key={partition.partition}>{partition.offset}</ListItem>
                            ))}
                          </List>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  ))}
                </SidebarContent>
              </Sidebar>
            </StackItem>
            <StackItem>
              <Alert variant="info" isInline title={t("dry_run_execution_alert")} />
            </StackItem>
            <StackItem>
              <Button variant="secondary">{t("back_to_edit_offset")}</Button>
            </StackItem>
          </Stack>
        </PanelMainBody>
      </PanelMain >
    </Panel >
  )
}
