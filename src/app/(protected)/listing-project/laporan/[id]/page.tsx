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
  type Row = {
    nama: string;
    tanggal: string;
    repositoriDeveloper: string;
  };

  const [data, setData] = useState<Row[]>([
    {
      nama: "Dini",
      tanggal: "25 September 2025",
      repositoriDeveloper:
        "Update documentation and README with installation guide",
    },
    {
      nama: "Fajri",
      tanggal: "25 September 2025",
      repositoriDeveloper: "Add user authentication system with JWT tokens",
    },
    {
      nama: "Yeni",
      tanggal: "24 September 2025",
      repositoriDeveloper:
        "Fix bug in repository listing and improve performance",
    },
  ]);

  const [role, setRole] = useState<"admin" | "user">("admin");

  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newData, setNewData] = useState<Row | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState<
    "harian" | "mingguan" | "bulanan" | null
  >(null);

  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleEdit = (index: number) => {
    setIsEditing(true);
    setEditIndex(index);
    setNewData(data[index]);
  };

  const handleSave = () => {
    if (editIndex !== null && newData) {
      const updatedData = [...data];
      updatedData[editIndex] = newData;
      setData(updatedData);
      setIsEditing(false);
      setEditIndex(null);
      setNewData(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditIndex(null);
    setNewData(null);
  };

  return (
    <Card>
      <BreadcrumbSetItem
        items={[
          {
            title: "Listing Project",
          },
          {
            title: "Listing Project",
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
