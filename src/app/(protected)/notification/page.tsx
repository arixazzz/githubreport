"use client";

import { Filter } from "@/components/filters";
import {
  useGetNotification,
  useReadNotificationMutation,
} from "@/components/parts/notification/api";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import Pagination from "@/components/table/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";

const filterTab = [
  { title: "Semua", value: "" },
  { title: "Dibaca", value: "true" },
  { title: "Belum Dibaca", value: "false" },
];

export default function Page() {
  const router = useRouter();
  const params = useSearchParams();
  const qc = useQueryClient();

  const isMobile = useIsMobile();

  const readNotifMutation = useReadNotificationMutation();
  const { data } = useGetNotification(params.toString());
  const notificationData = data?.data;

  const handleRead = (id?: number) => {
    readNotifMutation.mutate(
      { id },
      {
        onSuccess: () => {
          qc.invalidateQueries({
            queryKey: ["useGetNotification"],
          });
          qc.invalidateQueries({
            queryKey: ["useGetNotificationCount"],
          });
        },
      }
    );
  };

  const handleTo = (
    refId: number,
    type:
      | "incommingLetter"
      | "disposition"
      | "outgoingLetter"
      | "verificatorLetter"
      | "verificationStatus"
      | "signerLetter"
      | "signatureStatus"
      | "visitorLetter"
      | "audienceLetter"
  ) => {
    const generateLink = () => {
      switch (type) {
        case "incommingLetter":
          return `/incoming-mail/physical/surat-keluar/detail/${refId}`;
        case "disposition":
          return `/disposition/detail/${refId}`;
        case "outgoingLetter":
          return `/incoming-mail/internal/all/detail/${refId}`;
        case "verificatorLetter":
          return `/verification/detail/${refId}`;
        case "verificationStatus":
          return `/verification/detail/${refId}`;
        case "signerLetter":
          return `/signature/detail/${refId}`;
        case "signatureStatus":
          return `/signature/detail/${refId}`;
        case "visitorLetter":
          return `/incoming-mail/visit/detail/${refId}`;
        case "audienceLetter":
          return `/incoming-mail/audience/detail/${refId}`;
        default:
          return undefined;
      }
    };
    const link = generateLink();
    if (link) router.push(link);
  };

  return (
    <main>
      <BreadcrumbSetItem
        items={[
          {
            title: "Notifikasi",
          },
        ]}
      />
      <Card className="mt-5">
        <CardHeader className="flex flex-row gap-x-6 mt-4 items-center justify-between overflow-x-scroll">
          <Filter initialValues={{ readStatus: "" }}>
            {({ setValue, values }) => (
              <Tabs
                defaultValue=""
                value={values.readStatus}
                onValueChange={(val) => setValue("readStatus", val)}
              >
                <TabsList className="bg-transparent gap-x-3">
                  {filterTab.map((f, i) => (
                    <TabsTrigger
                      key={i}
                      value={f.value}
                      className={cn(
                        "rounded-full !border border-primary text-primary py-2 px-6",
                        "data-[state=active]:bg-primary data-[state=active]:text-white"
                      )}
                    >
                      {f.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
          </Filter>

          <Button variant={"link"} onClick={() => handleRead()}>
            Tandai dibaca semua
          </Button>
        </CardHeader>
        <Separator className="mx-6 w-auto" />
        <CardContent>
          {notificationData?.items.map((item, i) => (
            <div
              key={i}
              className={cn(
                "min-h-20 border-b flex gap-x-10 items-center cursor-pointer px-6",
                {
                  "bg-gray-200/30": !item.readStatus,
                }
              )}
              onClick={() => {
                handleRead(item.id);
                handleTo(Number(item.refId), item.type as any);
              }}
            >
              <p className="flex-1">{item.message}</p>
              <p className="flex-shrink-0">
                {format(item.deliveredAt, "dd MMMM yyyy hh:mm")}
              </p>
            </div>
          ))}
          {/*  */}
          <Pagination
            currentPage={notificationData?.current_page ?? 1}
            itemsPerPage={notificationData?.items_per_page ?? 10}
            totalItems={notificationData?.total_items ?? 0}
            totalPages={notificationData?.total_pages ?? 1}
            displayItems={!isMobile}
          />
        </CardContent>
      </Card>
    </main>
  );
}
