"use client";

import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import { laporanColumns } from "@/components/parts/laporan/column"; // assuming column definitions are here
import TitleHeader from "@/components/shared/title";
import DataTable from "@/components/table/dataTable";
import { Button } from "@/components/ui/button";
import { FiFilter, FiChevronDown } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { TableProvider } from "@/components/table";
import TableBar from "@/components/table/tableBar";

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [data, setData] = useState<ReportResponse[]>([]); // Reports data
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newDeskripsi, setNewDeskripsi] = useState<string>("");
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState<
    "harian" | "mingguan" | "bulanan" | null
  >(null);
  const [load, setLoad] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  // Fetch report data from API
  useEffect(() => {
    if (!id) {
      setErr("Project ID not found");
      setLoad(false);
      return;
    }
    async function loadData() {
      try {
        const res = await fetch(`/api/report/get/${id}`, { method: "GET" });
        const result = await res.json();
        setData(result.reports || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleEdit = (index: number) => {
    setIsEditing(true);
    setEditIndex(index);
    setNewDeskripsi(data[index].conclusion); // Set initial value for editing
  };

  const handleSave = () => {
    if (editIndex !== null && newDeskripsi) {
      const updatedData = [...data];
      updatedData[editIndex].conclusion = newDeskripsi; // Update the conclusion
      setData(updatedData);
      setIsEditing(false);
      setEditIndex(null);
      setNewDeskripsi("");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditIndex(null);
    setNewDeskripsi("");
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Card>
      <BreadcrumbSetItem
        items={[
          {
            title: "Reports",
          },
          {
            title: "Project Reports",
          },
        ]}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <TitleHeader title="Laporan Project" />
        </div>
      </div>

      <div className="mt-4">
        <Button
          className="w-full py-2 px-4 rounded-full"
          onClick={() => alert("Generate Report clicked")}
        >
          Generate Report
        </Button>
      </div>

      <div className="mt-4">
        <DataTable columns={laporanColumns} data={data} />
      </div>

      {/* Modal for editing description */}
      {/* {isEditing && (
        <Modal isOpen={isEditing} onClose={handleCancel}>
          <div className="p-4">
            <h3 className="text-xl mb-4">Edit Deskripsi</h3>
            <textarea
              value={newDeskripsi}
              onChange={(e) => setNewDeskripsi(e.target.value)}
              className="w-full p-2 border rounded"
              rows={4}
            />
            <div className="mt-4 flex justify-end">
              <Button onClick={handleCancel} className="mr-2">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-blue-500 text-white">
                Save
              </Button>
            </div>
          </div>
        </Modal>
      )} */}
    </Card>
  );
};

export default Page;
