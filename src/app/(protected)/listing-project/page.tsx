"use client";

import { FilterTextInput } from "@/components/filters";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import TitleHeader from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Project {
  id: number; // id bertipe number sesuai dengan tipe di schema Prisma
  title: string;
  detail: string;
  deadline: string; // date di Prisma dapat direpresentasikan sebagai string di TypeScript
  stack: string;
  linkgithub: string;
}

const Page = () => {
  const [data, setData] = useState<Project[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/project/get", {
          method: "GET",
        });

        const json = await res.json();
        setData(json.project || []);
      } catch (error) {
        console.error("Gagal fetch data user:", error);
      }
    }

    load();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  // Filter projects based on search query
  const filteredProjects = data.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get the current projects based on pagination
  const currentProjects = filteredProjects.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "..."; // Potong dan tambahkan "..."
    }
    return text;
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
        {currentProjects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col gap-3 p-4 border border-gray-200 rounded-lg shadow-sm"
          >
            <h3 className="font-bold text-lg">{project.title}</h3>
            <p className="text-sm text-gray-600">
              {truncateText(project.detail, 70)}
            </p>
            <div className="flex gap-2 mt-3">
              <Link href={`/listing-project/detail/${project.id}`}>
                <Button className="rounded-full bg-blue-500 text-white">
                  Detail
                </Button>
              </Link>

              <Link href={`/listing-project/laporan/${project.id}`}>
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
