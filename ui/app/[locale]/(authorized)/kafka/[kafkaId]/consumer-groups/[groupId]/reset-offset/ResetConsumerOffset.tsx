"use client";

import { Divider, Panel, PanelHeader, PanelMain, PanelMainBody, TextContent, Text, TextVariants, Radio, Form, FormGroup, FormSection, Select, SelectList, SelectOption, MenuToggle, MenuToggleElement, TextInput, ActionGroup, Button, SelectProps, PageSection } from "@/libs/patternfly/react-core";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { DateTimeFormatSelection, OffsetValue, TopicSelection, partitionSelection } from "../types";
import { TypeaheadSelect } from "./TypeaheadSelect";
import { OffsetSelect } from "./OffsetSelect";
import { useRouter } from "@/navigation";

export function ResetConsumerOffset({
  consumerGroupName,
  topics,
  partitions,
  baseurl

}: {
  consumerGroupName: string;
  topics: string[];
  partitions: number[];
  baseurl: string;
}) {
  const t = useTranslations("ConsumerGroupsTable");

  const router = useRouter();

  const [selectedConsumerTopic, setSelectedConsumerTopic] = useState<TopicSelection>();

  const [selectedPartition, setSelectedPartition] = useState<partitionSelection>();

  const [selectedOffset, setSelectedOffset] = useState<OffsetValue>("custom");

  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const [selectPartition, setSelectPartition] = useState<number>(0);

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

  const handleTopicChange = (item: string | number) => {
    if (typeof item === 'string') {
      setSelectedTopic(item);
    } else {
      console.warn('Expected a string, but got number:', item);

    }
  };

  const handlePartitionChange = (item: string | number) => {
    if (typeof item === 'number') {
      setSelectPartition(item);
    } else {
      console.warn('Expected a number, but got a string:', item);
    }
  };

  const openDryrun = () => {
    router.push(`${baseurl}/reset-offset/dryrun`)
  }

  const closeResetOffset = () => {
    router.push(`${baseurl}`)
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
                  onChange={handleTopicChange} placeholder={"Select topic"} />
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
                  onChange={handlePartitionChange}
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
              <Button variant="secondary" onClick={openDryrun}>{t("dry_run")}</Button>
              <Button variant="link" onClick={closeResetOffset}>{t("cancel")}</Button>
            </ActionGroup>
          </Form>
        </PanelMainBody>
      </PanelMain>
    </Panel >
  )
}
