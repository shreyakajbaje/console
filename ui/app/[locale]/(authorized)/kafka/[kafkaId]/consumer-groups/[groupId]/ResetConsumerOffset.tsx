import { Divider, Panel, PanelHeader, PanelMain, PanelMainBody, TextContent, Text, TextVariants, Radio, Form, FormGroup, FormSection, Select, SelectList, SelectOption, MenuToggle, MenuToggleElement, TextInput, ActionGroup, Button, SelectProps } from "@/libs/patternfly/react-core";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { TopicSelection, partitionSelection } from "./types";
import { TypeaheadSelect } from "./TypeaheadSelect";

export function ResetConsumerOffset({
  consumerGroupName,
  members,
  topics,
  partitions
}: {
  consumerGroupName: string;
  members: string[];
  topics: string[];
  partitions: string[];
}) {

  // const date = new Date()
  // console.log(date)

  const t = useTranslations("ConsumerGroupsTable");

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [selectedConsumerTopic, setSelectedConsumerTopic] = useState<TopicSelection>();

  const [selectedPartition, setSelectedPartition] = useState<partitionSelection>();

  const [selectedOffset, setSelectedOffset] = useState<string>("select offset");

  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const [selectPartition, setSelectPartition] = useState<string>("");

  const [customOffsetValue, setcustomOffsetValue] = useState<string>();

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const onTopicSelect = (value: TopicSelection) => {
    setSelectedConsumerTopic(value);
  };

  const onPartitionSelect = (value: partitionSelection) => {
    setSelectedPartition(value);
  };

  const onSelect: SelectProps["onSelect"] = (_, value: string | number | undefined) => {
    setSelectedOffset(value as string);
    setIsOpen(false);
  };


  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggle}
      isExpanded={isOpen}
      style={
        {
          width: '200px'
        } as React.CSSProperties
      }
    >
      {selectedOffset}
    </MenuToggle>
  );


  return (
    <Panel>
      <PanelHeader>
        <TextContent>
          <Text component={TextVariants.h1}>{t("reset_consumer_offset")}</Text>
        </TextContent>
        <TextContent>
          <Text>{t.rich("consumer_name", { consumerGroupName })}</Text>
        </TextContent>
      </PanelHeader>
      <Divider />
      <PanelMain>
        <PanelMainBody>
          <Form>
            <FormSection title={t("target")}>
              <FormGroup role="radiogroup" isInline fieldId="select-consumer" hasNoPaddingTop label={t("apply_action_on")}>
                <Radio name={"consumer-topic-select"} id={"all-consumer-topic"} label={t("all_consumer_topics")}
                  isChecked={selectedConsumerTopic === "allTopics"}
                  onChange={() => onTopicSelect("allTopics")} />
                <Radio name={"consumer-topic-select"} id={"selected-topic"} label={t("selected_topic")} isChecked={selectedConsumerTopic === "selectedTopic"}
                  onChange={() => onTopicSelect("selectedTopic")} />
              </FormGroup>
              {selectedConsumerTopic === "selectedTopic" && (
                <TypeaheadSelect
                  value={selectedTopic}
                  selectItems={topics}
                  onChange={setSelectedTopic} placeholder={"Select topic"} />
              )}
              <FormGroup label={t("partitions")} isInline>
                <Radio name={"partition-select"} id={"all-partitions"} label={t("all_partitions")}
                  isChecked={selectedPartition === "allPartitions"}
                  onChange={() => onPartitionSelect("allPartitions")} />
                <Radio name={"partition-select"} id={"selected_partition"} label={t("selected_partition")}
                  isChecked={selectedPartition === "selectedPartition"}
                  onChange={() => onPartitionSelect("selectedPartition")} />
              </FormGroup>
              {selectedConsumerTopic === "selectedTopic" && selectedPartition === "selectedPartition" && (
                <TypeaheadSelect
                  value={selectPartition}
                  selectItems={partitions}
                  onChange={setSelectPartition}
                  placeholder={"Select partition"}
                />
              )}
            </FormSection>
            <FormSection title={t("offset_details")}>
              <FormGroup label={t("new_offset")}>
                <Select
                  id="offset-select"
                  isOpen={isOpen}
                  selected={selectedOffset}
                  onSelect={onSelect}
                  toggle={toggle}>
                  <SelectList>
                    <SelectOption value={t("offset.custom")}>{t("offset.custom")}</SelectOption>
                    <SelectOption value={t("offset.earliest")}>{t("offset.earliest")}</SelectOption>
                    <SelectOption value={t("offset.latest")}>{t("offset.latest")}</SelectOption>
                    <SelectOption value={t("offset.specific_date_time")}>{t("offset.specific_date_time")}</SelectOption>
                  </SelectList>
                </Select>
              </FormGroup>
              {selectedOffset === "Custom offset" &&
                <FormGroup
                  label={t("custom_offset")}
                  fieldId="custom-offset-input"
                >
                  <TextInput
                    id="custom-offset-input"
                    name={t("custom_offset")}
                    value={customOffsetValue}
                    onChange={(_event, value) => setcustomOffsetValue(value)}
                    type="number"
                  />
                </FormGroup>}
              {selectedOffset === "Specific Date time" &&
                <>
                  <FormGroup role="radiogroup" isInline fieldId="select-consumer" hasNoPaddingTop label={t("select_date_time")}>
                    <Radio name={"iso_date_format"} id={"iso_date_format"} label={t("iso_date_format")} />
                    <Radio name={"unix_date_format"} id={"unix_date_format"} label={t("unix_date_format")} />
                  </FormGroup>
                  <FormGroup>
                    <TextInput
                      id="date-input"
                      name={"date-input"}
                      type="datetime-local"
                    />
                  </FormGroup>
                </>}
            </FormSection>
            <ActionGroup>
              <Button variant="primary">{t("save")}</Button>
              <Button variant="secondary">{t("dry_run")}</Button>
              <Button variant="link">{t("cancel")}</Button>
            </ActionGroup>
          </Form>
        </PanelMainBody>
      </PanelMain>

    </Panel >
  )
}
