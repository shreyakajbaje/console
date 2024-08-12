"use client";

import { ConsumerGroup, ConsumerGroupState } from "@/api/consumerGroups/schema";
import { Number } from "@/components/Format/Number";
import { LabelLink } from "@/components/Navigation/LabelLink";
import { TableView, TableViewProps } from "@/components/Table";
import { Icon, LabelGroup, Tooltip } from "@/libs/patternfly/react-core";
import { CheckCircleIcon, HelpIcon, InfoCircleIcon } from "@/libs/patternfly/react-icons";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { ReactNode, useEffect, useState } from "react";

export const ConsumerGroupColumns = [
  "name",
  "state",
  "lag",
  "members",
  "topics",
] as const;

export type ConsumerGroupColumn = (typeof ConsumerGroupColumns)[number];

export type SortableConsumerGroupTableColumns = Exclude<
  ConsumerGroupColumn,
  "lag" | "members" | "topics">;

export const SortableColumns = ["name", "state"];

const StateLabel: Record<ConsumerGroupState, ReactNode> = {
  STABLE: (
    <>
      <Icon status={"success"}>
        <CheckCircleIcon />
      </Icon>
      &nbsp;STABLE
    </>
  ),
  EMPTY: (
    <>
      <Icon status={"info"}>
        <InfoCircleIcon />
      </Icon>
      &nbsp;EMPTY
    </>
  )
}

export function ConsumerGroupsTable({
  kafkaId,
  page,
  perPage,
  total,
  consumerGroups: initialData,
  refresh,
  isColumnSortable,
  filterName,
  filterState,
  onFilterNameChange,
  onFilterStateChange,
  onPageChange,
  onResetOffset
}: {
  kafkaId: string;
  page: number;
  perPage: number;
  total: number;
  filterName: string | undefined;
  filterState: ConsumerGroupState[] | undefined;
  consumerGroups: ConsumerGroup[] | undefined;
  refresh: (() => Promise<ConsumerGroup[]>) | undefined;
  onFilterNameChange: (name: string | undefined) => void;
  onFilterStateChange: (status: ConsumerGroupState[] | undefined) => void;
  onResetOffset: () => void;
} & Pick<
  TableViewProps<ConsumerGroup, (typeof ConsumerGroupColumns)[number]>,
  "isColumnSortable" | "onPageChange" | "onClearAllFilters"
>) {
  const t = useTranslations();
  const [consumerGroups, setConsumerGroups] = useState(initialData);
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (refresh) {
      interval = setInterval(async () => {
        const consumerGroups = await refresh();
        if (consumerGroups) {
          setConsumerGroups(consumerGroups);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [refresh]);
  return (
    <TableView
      itemCount={consumerGroups?.length}
      page={page}
      perPage={perPage}
      onPageChange={onPageChange}
      data={consumerGroups}
      emptyStateNoData={
        <div>{t("ConsumerGroupsTable.no_consumer_groups")}</div>
      }
      emptyStateNoResults={
        <div>{t("ConsumerGroupsTable.no_consumer_groups")}</div>
      }
      ariaLabel={t("ConsumerGroupsTable.title")}
      isFiltered={
        filterName !== undefined || filterState?.length !== 0
      }
      columns={ConsumerGroupColumns}
      isColumnSortable={isColumnSortable}
      renderHeader={({ column, key, Th }) => {
        switch (column) {
          case "name":
            return (
              <Th key={key} width={30}>
                {t("ConsumerGroupsTable.consumer_group_name")}
              </Th>
            );
          case "state":
            return (
              <Th key={key}>
                {t("ConsumerGroupsTable.state")}{" "}
                <Tooltip content={t.rich("ConsumerGroupsTable.state_tooltip")}>
                  <HelpIcon />
                </Tooltip>
              </Th>
            );
          case "lag":
            return (
              <Th key={key}>
                {t("ConsumerGroupsTable.overall_lag")}{" "}
                <Tooltip
                  style={{ whiteSpace: "pre-line" }}
                  content={t.rich("ConsumerGroupsTable.overall_lag_tooltip")}
                >
                  <HelpIcon />
                </Tooltip>
              </Th>
            );
          case "members":
            return (
              <Th key={key}>
                {t("ConsumerGroupsTable.members")}{" "}
                <Tooltip
                  content={t.rich("ConsumerGroupsTable.members_tooltip")}
                >
                  <HelpIcon />
                </Tooltip>
              </Th>
            );
          case "topics":
            return <Th key={key}>{t("ConsumerGroupsTable.topics")}</Th>;
        }
      }}
      renderCell={({ row, column, key, Td }) => {
        switch (column) {
          case "name":
            return (
              <Td
                key={key}
                dataLabel={t("ConsumerGroupsTable.consumer_group_name")}
              >
                <Link
                  href={`/kafka/${kafkaId}/consumer-groups/${row.id === "" ? "+" : encodeURIComponent(row.id)}`}
                >
                  {row.id === "" ? (
                    <i>{t("ConsumerGroupsTable.empty_name")}</i>
                  ) : (
                    row.id
                  )}
                </Link>
              </Td>
            );
          case "state":
            return (
              <Td key={key} dataLabel={t("ConsumerGroupsTable.state")}>
                {StateLabel[row.attributes.state]}
              </Td>
            );
          case "lag":
            return (
              <Td key={key} dataLabel={t("ConsumerGroupsTable.overall_lag")}>
                <Number
                  value={row.attributes.offsets
                    ?.map((o) => o.lag)
                    // lag values may not be available from API, e.g. when there is an error listing the topic offsets
                    .reduce((acc, v) => (acc ?? NaN) + (v ?? NaN), 0)}
                />
              </Td>
            );
          case "topics":
            const allTopics =
              row.attributes.members?.flatMap((m) => m.assignments ?? []) ?? [];
            return (
              <Td key={key} dataLabel={t("ConsumerGroupsTable.topics")}>
                <LabelGroup>
                  {Array.from(new Set(allTopics.map((a) => a.topicName))).map(
                    (topic, idx) => (
                      <LabelLink
                        key={idx}
                        color={"blue"}
                        href={`/kafka/${kafkaId}/topics/${allTopics.find((t) => t.topicName === topic)!.topicId
                          }`}
                      >
                        {topic}
                      </LabelLink>
                    ),
                  )}
                </LabelGroup>
              </Td>
            );
          case "members":
            return (
              <Td key={key} dataLabel={t("ConsumerGroupsTable.members")}>
                <Number value={row.attributes.members?.length} />
              </Td>
            );
        }
      }}
      renderActions={({ row, ActionsColumn }) => (
        <ActionsColumn items={[{
          title: t('ConsumerGroupsTable.reset_offset'),
          description: t('ConsumerGroupsTable.reset_offset_description'),
          onClick: () => {
            onResetOffset()
          },
        }]} />
      )}
      filters={{
        Name: {
          type: "search",
          chips: filterName ? [filterName] : [],
          onSearch: onFilterNameChange,
          onRemoveChip: () => {
            onFilterNameChange(undefined);
          },
          onRemoveGroup: () => {
            onFilterNameChange(undefined)
          },
          validate: () => true,
          errorMessage: ""
        },
        State: {
          type: "checkbox",
          chips: filterState || [],
          onToggle: (state) => {
            const newState = filterState?.includes(state) ? filterState.filter((s) => s !== state) : [...filterState!, state];
            onFilterStateChange(newState);
          },
          onRemoveChip: (state) => {
            const newStatus = (filterState || []).filter((s) => s !== state);
            onFilterStateChange(newStatus);
          },
          onRemoveGroup: () => {
            onFilterStateChange(undefined);
          },
          options: StateLabel,
        }
      }}
    />
  );
}
