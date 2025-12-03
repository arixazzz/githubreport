"use client";

import {
  dummyLaporan,
  laporanColumns,
} from "@/components/parts/laporan/column";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import TitleHeader from "@/components/shared/title";
import DataTable from "@/components/table/dataTable";
import { Button } from "@/components/ui/button";
import { FiFilter, FiChevronDown } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import { TableProvider } from "@/components/table";
import TableBar from "@/components/table/tableBar";

const Page = () => {
  return (
    <Card>
      <BreadcrumbSetItem
        items={[
          {
            title: "Listing Project",
          },
          {
            title: "Listing Project",
            href: "/listing-project",
          },
          {
            title: "Laporan",
          },
        ]}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <TitleHeader title="Laporan Project" />
        </div>
      </div>

      <TableProvider>
        <TableBar filterItems={["date"]} />
        <div className="mt-4">
          <DataTable
            columns={laporanColumns}
            data={dummyLaporan}
            displayItems
            displayPageSize
          />
        </div>
      </TableProvider>
    </Card>
  );
};

export default Page;
