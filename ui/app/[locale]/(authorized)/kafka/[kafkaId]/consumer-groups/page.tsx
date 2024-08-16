import { getConsumerGroups } from "@/api/consumerGroups/actions";
import { KafkaParams } from "@/app/[locale]/(authorized)/kafka/[kafkaId]/kafka.params";
import { PageSection } from "@/libs/patternfly/react-core";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ConsumerGroupsTable, SortableColumns, SortableConsumerGroupTableColumns } from "./ConsumerGroupsTable";
import { ConsumerGroup, ConsumerGroupState } from "@/api/consumerGroups/schema";
import { stringToInt } from "@/utils/stringToInt";
import { ConnectedConsumerGroupsTable } from "./ConnectedConsumerGroupTable";

const sortMap: Record<(typeof SortableColumns)[number], string> = {
  name: "name",
  state: "state",
};

export default function ConsumerGroupsPage({
  params: { kafkaId },
  searchParams,
}: {
  params: KafkaParams;
  searchParams: {
    name: string | undefined;
    state: string | undefined;
    perPage: string | undefined;
    sort: string | undefined;
    sortDir: string | undefined;
    page: string | undefined;
  };
}) {
  const name = searchParams["name"];
  const pageSize = stringToInt(searchParams.perPage) || 20;
  const sort = (searchParams["sort"] || "name") as SortableConsumerGroupTableColumns;
  const sortDir = (searchParams["sortDir"] || "asc") as "asc" | "desc";
  const pageCursor = searchParams["page"];
  const state = (searchParams["state"] || "").split(",").filter((v) => !!v) as ConsumerGroupState[] | undefined;

  return (
    <PageSection>
      <Suspense fallback={
        <ConnectedConsumerGroupsTable
          kafkaId={kafkaId}
          consumerGroups={undefined}
          consumerGroupCount={0}
          page={1}
          perPage={pageSize}
          name={name}
          sort={sort}
          sortDir={sortDir}
          state={state}
          baseurl={`/kafka/${kafkaId}/consumer-groups`}
          nextPageCursor={undefined}
          prevPageCursor={undefined}
          refresh={undefined} />
      }>
        <AsyncConnectedConsumerGroupsTable
          sort={sort}
          name={name}
          sortDir={sortDir}
          pageSize={pageSize}
          pageCursor={pageCursor}
          state={state}
          kafkaId={kafkaId} />
      </Suspense>
    </PageSection>
  )
}

async function AsyncConnectedConsumerGroupsTable({
  kafkaId,
  name,
  sortDir,
  sort,
  pageCursor,
  pageSize,
  state,
}: {
  sort: SortableConsumerGroupTableColumns;
  name: string | undefined;
  sortDir: "asc" | "desc";
  pageSize: number;
  pageCursor: string | undefined;
  state: ConsumerGroupState[] | undefined;
} & KafkaParams) {



  async function refresh() {
    "use server";
    const res = await getConsumerGroups(kafkaId, {
      name,
      state,
      sort: sortMap[sort],
      sortDir,
      pageSize,
      pageCursor,
    });
    return res?.data as ConsumerGroup[];
  }


  const consumerGroups = await getConsumerGroups(kafkaId, {
    name,
    state,
    sort: sortMap[sort],
    sortDir,
    pageSize,
    pageCursor,
  });
  if (!consumerGroups) {
    notFound();
  }

  console.log(consumerGroups)

  const nextPageQuery = consumerGroups.links.next
    ? new URLSearchParams(consumerGroups.links.next)
    : undefined;
  const nextPageCursor = nextPageQuery?.get("page[after]");
  const prevPageQuery = consumerGroups.links.prev
    ? new URLSearchParams(consumerGroups.links.prev)
    : undefined;
  const prevPageCursor = prevPageQuery?.get("page[after]");
  return (
    <ConnectedConsumerGroupsTable
      kafkaId={kafkaId}
      consumerGroups={consumerGroups.data}
      consumerGroupCount={consumerGroups.meta.page.total || 0} page={0} perPage={0}
      name={name}
      sort={sort}
      sortDir={sortDir}
      state={state}
      baseurl={`/kafka/${kafkaId}/consumer-groups`}
      nextPageCursor={nextPageCursor}
      prevPageCursor={prevPageCursor}
      refresh={refresh} />
  );


}
