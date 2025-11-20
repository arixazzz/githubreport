"use client";

import { FilterTextInput } from "@/components/filters";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import TitleHeader from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const Page = () => {
  const projects = new Array(6).fill({
    name: "PPDB SMA Perintis 2 Bandar Lampung",
    description:
      "Aplikasi SIPPP PUPR (Sistem Informasi Pelaksanaan, Pengawasan, dan Pelaporan) adalah sebuah platform yang dikembangkan untuk Dinas ........",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentProjects = filteredProjects.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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
      <TitleHeader title="Listing Project" />
      <div className="flex gap-3 mb-4">
        <FilterTextInput
          placeholder="Cari"
          name="search"
          prefixIcon={<Search size={20} color="#473D3D" />}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Link href={"/listing-project/create"}>
          <Button className="rounded-full">Tambah Project</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentProjects.map((project, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 p-4 border border-gray-200 rounded-lg shadow-sm"
          >
            <h3 className="font-bold text-lg">{project.name}</h3>
            <p className="text-sm text-gray-600">{project.description}</p>
            <div className="flex gap-2 mt-3">
              <Link href={"/listing-project/detail/2"}>
                <Button className="rounded-full bg-blue-500 text-white">
                  Detail
                </Button>
              </Link>
              <Link href={"/listing-project/laporan/2"}>
                <Button className="rounded-full bg-gray-500 text-white">
                  Laporan
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center pt-4">
        <p className="text-sm">
          Menampilkan {currentProjects.length} data dari{" "}
          {filteredProjects.length} data
        </p>
        <div className="flex gap-3">
          <Button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="bg-gray-200 rounded-full"
          >
            &lt;
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={page * itemsPerPage >= filteredProjects.length}
            className="bg-gray-200 rounded-full"
          >
            &gt;
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Page;
