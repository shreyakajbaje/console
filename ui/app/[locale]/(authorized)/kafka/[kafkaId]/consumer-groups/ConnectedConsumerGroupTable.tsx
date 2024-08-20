"use client";

import { ConsumerGroup, ConsumerGroupState } from "@/api/consumerGroups/schema";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/navigation";
import { useFilterParams } from "@/utils/useFilterParams";
import { useOptimistic, useTransition } from "react";
import { ConsumerGroupColumn, ConsumerGroupColumns, ConsumerGroupsTable, SortableColumns } from "./ConsumerGroupsTable";
import { ResetOffsetModal } from "./[groupId]/ResetOffsetModal";


export type ConnectedConsumerGroupsTableProps = {
  kafkaId: string;
  consumerGroups: ConsumerGroup[] | undefined;
  consumerGroupCount: number;
  page: number;
  perPage: number;
  name: string | undefined;
  sort: ConsumerGroupColumn;
  sortDir: "asc" | "desc";
  state: ConsumerGroupState[] | undefined;
  baseurl: string;
  nextPageCursor: string | null | undefined;
  prevPageCursor: string | null | undefined;
  refresh: (() => Promise<ConsumerGroup[]>) | undefined;
};

type State = {
  consumerGroups: ConsumerGroup[] | undefined;
  name: string | undefined;
  perPage: number;
  sort: ConsumerGroupColumn;
  sortDir: "asc" | "desc";
  state: ConsumerGroupState[] | undefined;
};

export function ConnectedConsumerGroupsTable({
  kafkaId,
  page,
  perPage,
  name,
  state,
  sort,
  sortDir,
  nextPageCursor,
  prevPageCursor,
  baseurl,
  refresh
}: ConnectedConsumerGroupsTableProps) {
  const t = useTranslations();

  const router = useRouter();
  const _updateUrl = useFilterParams({ perPage, sort, sortDir });
  const [_, startTransition] = useTransition();


  const [consumerState, addOptimistic] = useOptimistic<
    State,
    Partial<Omit<State, "consumerGroups">>
  >(
    {
      name,
      perPage,
      sort,
      sortDir,
      state,
      consumerGroups: undefined
    },
    (state, options) => ({ ...state, ...options, consumerGroups: undefined }),
  );

  const updateUrl: typeof _updateUrl = (newParams) => {
    const { consumerGroups, ...s } = consumerState;
    _updateUrl({
      ...s,
      ...newParams,
    });
  };

  function clearFilters() {
    startTransition(() => {
      _updateUrl({});
      addOptimistic({
        name: undefined,
        state: undefined,
      });
    });
  }

  const [isResetOffsetModalOpen, setResetOffsetModalOpen] = useState(false);
  const [ConsumerGroupMembers, setConsumerGroupMembers] = useState<string[]>([]);

  const [consumerGroupName, setConsumerGroupName] = useState<string>();
  const [topics, setTopics] = useState<string[]>([]);

  function closeResetOffsetModal() {
    setResetOffsetModalOpen(false);
    setConsumerGroupMembers([]);
    router.push(`${baseurl}`);
  }


  return (
    <>
      <ConsumerGroupsTable
        kafkaId={kafkaId}
        page={page}
        perPage={consumerState.perPage}
        isColumnSortable={(col) => {
          if (!SortableColumns.includes(col)) {
            return undefined;
          }
          const activeIndex = ConsumerGroupColumns.indexOf(consumerState.sort);
          const columnIndex = ConsumerGroupColumns.indexOf(col);
          return {
            label: col as string,
            columnIndex,
            onSort: () => {
              startTransition(() => {
                const newSortDir = activeIndex === columnIndex
                  ? consumerState.sortDir === "asc"
                    ? "desc"
                    : "asc"
                  : "asc";
                updateUrl({
                  sort: col,
                  sortDir: newSortDir,
                });
                addOptimistic({ sort: col, sortDir: newSortDir });
              });
            },
            sortBy: {
              index: activeIndex,
              direction: consumerState.sortDir,
              defaultDirection: "asc",
            },
            isFavorites: undefined,
          };
        }}
        total={0}
        consumerGroups={consumerState.consumerGroups}
        refresh={refresh}
        onResetOffset={(row) => {
          startTransition(() => {
            if (row.attributes.state === "STABLE") {
              setResetOffsetModalOpen(true)
              setConsumerGroupMembers(row.attributes.members?.map((member) => member.memberId) || []);
              router.push(`${baseurl}/${row.id}/reset-offset`);
            } else if (row.attributes.state === "EMPTY") {
              router.push(`${baseurl}/${row.id}/reset-offset`);
            }
          });
        }}
        onPageChange={(newPage, perPage) => {
          startTransition(() => {
            const pageDiff = newPage - page;
            switch (pageDiff) {
              case -1:
                updateUrl({ perPage, page: prevPageCursor });
                break;
              case 1:
                updateUrl({ perPage, page: nextPageCursor });
                break;
              default:
                updateUrl({ perPage });
                break;
            }
            addOptimistic({ perPage });
          });
        }}
        filterName={consumerState.name}
        filterState={consumerState.state}
        onFilterNameChange={(name) => {
          startTransition(() => {
            updateUrl({ name });
            addOptimistic({ name });
          });
        }}
        onFilterStateChange={(state) => {
          startTransition(() => {
            updateUrl({ state });
            addOptimistic({ state });
          });
        }}
        onClearAllFilters={clearFilters}
      />
      {isResetOffsetModalOpen && (
        <ResetOffsetModal
          members={ConsumerGroupMembers}
          isResetOffsetModalOpen={isResetOffsetModalOpen}
          onClickClose={closeResetOffsetModal}
          refresh={refresh}
        />
      )}
    </>
  );
}
