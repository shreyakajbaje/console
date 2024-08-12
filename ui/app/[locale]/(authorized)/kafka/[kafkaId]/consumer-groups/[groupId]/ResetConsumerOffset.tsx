import { Divider, Panel, PanelHeader, PanelMain, PanelMainBody, TextContent, Text, TextVariants, Radio, Form, FormGroup, FormSection, Select, SelectList, SelectOption, MenuToggle, MenuToggleElement, TextInput, ActionGroup, Button } from "@/libs/patternfly/react-core";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { formatISO } from "date-fns";

export function ResetConsumerOffset({
  consumerGroupName,
  members
}: {
  consumerGroupName: string;
  members: string[];
}) {

  const date = new Date()
  console.log(date)

  const t = useTranslations("ConsumerGroupsTable");

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [selectedOffset, setSelectedOffset] = useState<string>("select offset");

  const [selectedTopic, setSelectedTopic] = useState<boolean>(false)

  const [customOffsetValue, setcustomOffsetValue] = useState<string>();

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
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
                <Radio name={"all-consumer-topic"} id={"all-consumer-topic"} label={t("all_consumer_topics")} />
                <Radio name={"selected-topic"} id={"selected-topic"} label={t("selected_topic")} />
              </FormGroup>

              <FormGroup label={t("partitions")} isInline>
                <Radio name={"all-partitions"} id={"all-partitions"} label={t("all_partitions")} />
                <Radio name={"selected_partition"} id={"selected_partition"} label={t("selected_partition")} />
              </FormGroup>
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
