"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  displayItems?: boolean;
  displayPageSize?: boolean;
  onChange?: ({ page, limit }: { page: number; limit: number }) => void;
  variant?: {
    button: "rounded-md" | "rounded-full";
  };
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage = 0,
  totalItems = 0,
  itemsPerPage = 0,
  totalPages,
  displayItems,
  displayPageSize,
  onChange, // onChange prop to handle page and limit changes
  variant = {
    button: "rounded-md",
  },
}) => {
  const [localLimit, setLocalLimit] = useState(5);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const updateQueryParams = (nextParams: URLSearchParams) => {
    const q = nextParams.toString();
    const newUrl = `${pathname}${q ? `?${q}` : ""}`;
    router.replace(newUrl, { scroll: false });
  };

  // Get initial values from the URL
  useEffect(() => {
    const pageFromUrl = searchParams.get("page");
    const limitFromUrl = searchParams.get("limit");

    if (pageFromUrl) {
      // Set currentPage from URL, fallback to default if not present
      const page = parseInt(pageFromUrl, 10);
      if (!isNaN(page)) {
        onChange?.({ page, limit: localLimit });
      }
    }

    if (limitFromUrl) {
      // Set itemsPerPage from URL
      const limit = parseInt(limitFromUrl, 10);
      if (!isNaN(limit)) {
        setLocalLimit(limit);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Update URL when page or limit changes
  // useEffect(() => {
  //   router.push(`?page=${currentPage}&limit=${localLimit}`);
  // }, [currentPage, localLimit, router]);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    pages.push(1);

    if (currentPage > 3) pages.push("...");

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (onChange) {
      onChange({ page, limit: localLimit });
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      params.set("limit", String(localLimit)); // Set the limit to the local state limit
      updateQueryParams(params);
    }
  };

  const handleLimitChange = (newLimit: string) => {
    const limit = parseInt(newLimit, 10);
    if (onChange) {
      setLocalLimit(limit);
      onChange({ page: 1, limit });
    } else {
      setLocalLimit(parseInt(newLimit, 10));
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1"); // Set page back to 1
      params.set("limit", newLimit);
      updateQueryParams(params);
    }
  };

  useEffect(() => {
    setLocalLimit(itemsPerPage);
  }, [itemsPerPage]);

  return (
    <div className="flex items-center justify-end gap-5 w-full my-6">
      {displayItems && (
        <React.Fragment>
          <div className="text-primary-500">
            {Math.min(currentPage * itemsPerPage, totalItems)} data dari{" "}
            {totalItems} data
          </div>
          {displayPageSize && (
            <Select
              value={itemsPerPage?.toString() ?? "10"}
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
          )}
        </React.Fragment>
      )}

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "w-9 h-9 flex items-center justify-center border border-primary text-primary disabled:opacity-50",
            variant.button
          )}
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
              className="w-9 h-9 flex items-center justify-center text-primary"
            >
              ...
            </span>
          ) : (
            <Button
              variant="ghost"
              key={`page-${page}`}
              onClick={() => handlePageChange(page as number)}
              className={cn(
                `w-9 h-9 flex items-center justify-center border border-primary`,
                currentPage === page
                  ? "bg-primary hover:bg-primary-800 text-white hover:text-white"
                  : "text-primary",
                variant.button
              )}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="ghost"
          onClick={() =>
            currentPage < totalPages && handlePageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages}
          className={cn(
            "w-9 h-9 flex items-center justify-center border border-primary text-primary disabled:opacity-50",
            variant.button
          )}
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
