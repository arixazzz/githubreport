"use client";

import { FilterTextInput } from "@/components/filters";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import TitleHeader from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePermission } from "@/hooks/useGetPermission";

interface Project {
  id: number;
  title: string;
  detail: string;
  deadline: string;
  stack: string;
  githubOwner: string;
  githubRepo: string;
  visibility: "PUBLIC" | "PRIVATE";
}

const Page = () => {
  const [data, setData] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { roles } = usePermission();

  async function load() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/project/get", {
        method: "GET",
      });

      const json = await res.json();
      setData(json.project || []);
    } catch (error) {
      console.error("Gagal fetch data project:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [deletingId, setDeletingId] = useState<number | null>(null);

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
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Yakin ingin menghapus project "${title}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/project/delete/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Project berhasil dihapus");
        load(); // Reload data
      } else {
        const error = await res.json();
        alert(`Gagal menghapus: ${error.error}`);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Terjadi kesalahan saat menghapus project");
    } finally {
      setDeletingId(null);
    }
  };

  const isAdmin = roles.includes("ADMIN");

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
        {isAdmin && (
          <Link href={"/listing-project/create"}>
            <Button className="rounded-full">Tambah Project</Button>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <p className="col-span-2 text-center py-10 text-gray-500">
            Memuat data project...
          </p>
        ) : currentProjects.length === 0 ? (
          <p className="col-span-2 text-center py-10 text-gray-500">
            Belum ada project{searchQuery && " yang cocok dengan pencarian"}.
          </p>
        ) : (
          currentProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col gap-3 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white relative"
            >
              {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-2">
                  <Link href={`/listing-project/edit/${project.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit size={16} />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(project.id, project.title)}
                    disabled={deletingId === project.id}
                  >
                    {deletingId === project.id ? (
                      <span className="text-[10px]">...</span>
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </Button>
                </div>
              )}

              <div className="flex justify-between items-start pr-20">
                <h3 className="font-bold text-lg text-gray-900 break-words w-full">
                  {project.title}
                </h3>
              </div>

              <div className="flex">
                <span
                  className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                    project.visibility === "PRIVATE"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {project.visibility}
                </span>
              </div>

              <p className="text-sm text-gray-600 min-h-[40px]">
                {truncateText(project.detail, 100)}
              </p>

              <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-md">
                <p className="flex items-center gap-2">
                  <span className="font-semibold w-16">Repo:</span>
                  <span className="font-mono text-blue-600">
                    {project.githubOwner}/{project.githubRepo}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold w-16">Stack:</span>
                  <span>{project.stack}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold w-16">Deadline:</span>{" "}
                  <span>
                    {new Date(project.deadline).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </p>
              </div>

              <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                <Link
                  href={`/listing-project/detail/${project.id}`}
                  className="flex-1"
                >
                  <Button className="w-full rounded-full bg-blue-600 text-white hover:bg-blue-700 h-8 text-xs">
                    Detail
                  </Button>
                </Link>

                <Link
                  href={`/listing-project/laporan/${project.id}`}
                  className="flex-1"
                >
                  <Button className="w-full rounded-full bg-gray-600 text-white hover:bg-gray-700 h-8 text-xs">
                    Laporan
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {!isLoading && filteredProjects.length > 0 && (
        <div className="flex justify-between items-center pt-4">
          <p className="text-sm text-gray-500">
            Menampilkan {currentProjects.length} dari {filteredProjects.length}{" "}
            project
          </p>
          <div className="flex gap-3">
            <Button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full h-8 w-8 p-0 flex items-center justify-center"
            >
              &lt;
            </Button>
            <span className="text-sm flex items-center">Halaman {page}</span>
            <Button
              onClick={handleNextPage}
              disabled={page * itemsPerPage >= filteredProjects.length}
              className="bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full h-8 w-8 p-0 flex items-center justify-center"
            >
              &gt;
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default Page;
