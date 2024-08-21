"use client";

import { Alert, Button, Card, DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm, Divider, Flex, FlexItem, JumpLinks, JumpLinksItem, List, ListItem, Panel, PanelHeader, PanelMain, PanelMainBody, Sidebar, SidebarContent, SidebarPanel, Stack, StackItem } from "@/libs/patternfly/react-core";
import { TextContent, Text } from "@/libs/patternfly/react-core";
import { useTranslations } from "next-intl";
import { DownloadIcon } from "@/libs/patternfly/react-icons";
import { useRouter } from "@/navigation";

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
  baseurl
}: {
  consumerGroupName: string;
  topics: TopicDetails[];
  baseurl: string;
}) {
  const t = useTranslations("ConsumerGroupsTable");

  const router = useRouter();

  const onClickCloseDryrun = () => {
    router.push(`${baseurl}`)
  }

  const onClickDownload = () => {
    const data = {
      consumerGroupName,
      topics,
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dryrun-result.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
            <Button variant="link" onClick={onClickDownload}>
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
              <TextContent>
                <Text>{t('cli_command')}</Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <Sidebar>
                <SidebarPanel>
                  <JumpLinks isVertical
                    label={t.rich("jump_to_topic")}
                  >
                    {topics.map((topic) => (
                      <JumpLinksItem key={topic.topicId}
                        href={`#topic-${topic.topicId}`}
                      >
                        {topic.topicName}
                      </JumpLinksItem>
                    ))}
                  </JumpLinks>
                </SidebarPanel>
                <SidebarContent>
                  <Stack hasGutter>
                    {topics.map((topic) => (
                      <StackItem key={topic.topicId}>
                        <Card component="div">
                          <DescriptionList id={`topic-${topic.topicId}`} >
                            <DescriptionListGroup>
                              <DescriptionListTerm>{t("topic")}</DescriptionListTerm>
                              <DescriptionListDescription>{topic.topicName}</DescriptionListDescription>
                            </DescriptionListGroup>
                            <Flex>
                              <FlexItem>
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
                              </FlexItem>
                              <FlexItem>
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
                              </FlexItem>
                            </Flex>
                          </DescriptionList>
                        </Card>
                      </StackItem>
                    ))}
                  </Stack>
                </SidebarContent>
              </Sidebar>
            </StackItem>
            <StackItem>
              <Alert variant="info" isInline title={t("dry_run_execution_alert")} />
            </StackItem>
            <StackItem>
              <Button variant="secondary" onClick={onClickCloseDryrun}>{t("back_to_edit_offset")}</Button>
            </StackItem>
          </Stack>
        </PanelMainBody>
      </PanelMain >
    </Panel >
  )
}
