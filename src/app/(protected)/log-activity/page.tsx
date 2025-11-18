"use client";

import { logActivityColumns } from "@/components/parts/log-activity/column";
import DataTable from "@/components/table/dataTable";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { useGetLogMe } from "@/components/parts/log-activity/api";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const params = useSearchParams();
  const { data } = useGetLogMe(params.toString());
  const logData = data?.data;
  return (
    <main>
      <BreadcrumbSetItem
        items={[
          {
            title: "Log Aktivitas",
          },
        ]}
      />
      <Card className="mt-5">
        <CardContent className="mt-8">
          <DataTable
            columns={logActivityColumns}
            data={logData?.items ?? []}
            currentPage={logData?.current_page ?? 1}
            totalItems={logData?.total_items ?? 0}
            totalPages={logData?.total_pages ?? 1}
          />
        </CardContent>
      </Card>
    </main>
  );
}
