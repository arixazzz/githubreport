// components/Pagination.tsx
"use client";

import React from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  totalPages,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const displayItems = () => {
    if (totalItems < itemsPerPage) return totalItems;
    if (currentPage === totalPages) return totalItems;

    return currentPage * itemsPerPage;
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Show dots if needed before middle pages
    if (currentPage > 3) {
      pages.push("...");
    }

    // Show current page and one before/after
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (
        pages[pages.length - 1] !== i - 1 &&
        pages[pages.length - 1] !== "..."
      ) {
        pages.push("...");
      }
      pages.push(i);
    }

    // Show dots if needed before last page
    if (currentPage < totalPages - 2) {
      if (
        pages[pages.length - 1] !== totalPages - 1 &&
        pages[pages.length - 1] !== "..."
      ) {
        pages.push("...");
      }
    }

    // Always show last page if there's more than one page
    if (totalPages > 1 && pages[pages.length - 1] !== totalPages) {
      pages.push(totalPages);
    }

    return pages;
  };

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleLimitChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", newLimit);
    params.set("page", "1"); // Reset ke halaman pertama
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-end gap-5 w-full my-6">
      <div className="text-blue-800 font-medium">
        {displayItems()} dari {totalItems ?? "-"} total data
      </div>

      <Select
        value={itemsPerPage?.toString() ?? "5"}
        onValueChange={handleLimitChange}
      >
        <SelectTrigger className="w-16 rounded-sm">
          <SelectValue placeholder={`${itemsPerPage}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          onClick={() => currentPage > 1 && navigateToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 flex items-center justify-center rounded border border-gray-300 disabled:opacity-50"
          aria-label="Previous page"
        >
          <span className="sr-only">Previous</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Button>

        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="w-9 h-9 flex items-center justify-center"
            >
              ...
            </span>
          ) : (
            <Button
              variant="ghost"
              key={`page-${page}`}
              onClick={() => navigateToPage(page as number)}
              className={`w-9 h-9 flex items-center justify-center rounded border ${
                currentPage === page
                  ? "bg-blue-800 text-white border-blue-800"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="ghost"
          onClick={() =>
            currentPage < totalPages && navigateToPage(currentPage + 1)
          }
          disabled={currentPage === totalPages}
          className="w-9 h-9 flex items-center justify-center rounded border border-gray-300 disabled:opacity-50"
          aria-label="Next page"
        >
          <span className="sr-only">Next</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
