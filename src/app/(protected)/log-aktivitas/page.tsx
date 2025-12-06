"use client";

import { logActivityColumns } from "@/components/parts/log-activity/column";
import DataTable from "@/components/table/dataTable";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { useGetLogMe } from "@/components/parts/log-activity/api";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { da } from "date-fns/locale";

// Interface for the LogActivity model
export interface LogActivity {
  id: number; // Unique identifier for the log activity
  userId: number; // ID of the user performing the activity
  activity: string; // The activity description (e.g., "User logged in")
  timestamp: Date; // Timestamp when the activity was created
  user: {
    id: number; // The user ID (foreign key relation)
    nama: string; // User's name
    usernamegithub: string; // GitHub username
    role: "USER" | "ADMIN"; // Role of the user
  }; // User object relation (the user who performed the activity)
}

export default function Page() {
  const params = useSearchParams();
  const [data, setData] = useState<LogActivity[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/log-aktivitas/get", {
          method: "GET",
        });

        const json = await res.json();
        setData(json.log || []);
      } catch (error) {
        console.error("Gagal fetch data user:", error);
      }
    }

    load();
  }, []);
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
          <DataTable columns={logActivityColumns} data={data ?? []} />
        </CardContent>
      </Card>
    </main>
  );
}
