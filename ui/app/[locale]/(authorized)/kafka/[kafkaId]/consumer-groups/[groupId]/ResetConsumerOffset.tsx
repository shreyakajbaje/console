import { Divider, Panel, PanelHeader, PanelMain, PanelMainBody, TextContent, Text, TextVariants, Radio, Form, FormGroup, FormSection, Select, SelectList, SelectOption, MenuToggle, MenuToggleElement, TextInput, ActionGroup, Button, SelectProps } from "@/libs/patternfly/react-core";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { DateTimeFormatSelection, OffsetValue, TopicSelection, partitionSelection } from "./types";
import { TypeaheadSelect } from "./TypeaheadSelect";
import { OffsetSelect } from "./OffsetSelect";

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
  const t = useTranslations("ConsumerGroupsTable");

  const [selectedConsumerTopic, setSelectedConsumerTopic] = useState<TopicSelection>();

  const [selectedPartition, setSelectedPartition] = useState<partitionSelection>();

  const [selectedOffset, setSelectedOffset] = useState<OffsetValue>("custom");

  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const [selectPartition, setSelectPartition] = useState<string>("");

  const [customOffsetValue, setcustomOffsetValue] = useState<string>();

  const [selectDateTimeFormat, setSelectDateTimeFormat] = useState<DateTimeFormatSelection>("ISO");

  const onTopicSelect = (value: TopicSelection) => {
    setSelectedConsumerTopic(value);
  };

  const onPartitionSelect = (value: partitionSelection) => {
    setSelectedPartition(value);
  };

  const onDateTimeSelect = (value: DateTimeFormatSelection) => {
    setSelectDateTimeFormat(value)
  }

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
                <OffsetSelect
                  value={selectedOffset}
                  onChange={setSelectedOffset} />
              </FormGroup>
              {selectedOffset === "custom" &&
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
              {selectedOffset === "specificDateTime" &&
                <>
                  <FormGroup role="radiogroup" isInline fieldId="select-consumer" hasNoPaddingTop label={t("select_date_time")}>
                    <Radio name={"select_time"} id={"iso_date_format"} label={t("iso_date_format")}
                      isChecked={selectDateTimeFormat === "ISO"}
                      onChange={() => onDateTimeSelect("ISO")} />
                    <Radio name={"select_time"} id={"unix_date_format"} label={t("unix_date_format")}
                      isChecked={selectDateTimeFormat === "Epoch"}
                      onChange={() => onDateTimeSelect("Epoch")} />
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
