"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "./pagination";
import { DataTableRef, useOptionalTableProvider } from "./tableProvider";
import { cn } from "@/lib/utils";
import SwirlingEffectSpinner from "../shared/swirlingEffectSpinner";

interface DataTableProps<TData, TValue> {
  columns: any[];
  data: TData[];
  currentPage?: number;
  totalItems?: number;
  totalPages?: number;
  displayItems?: boolean;
  displayPageSize?: boolean;
  onDoubleClickTo?: string;
  showPagination?: boolean;
  isLoading?: boolean;
}

const DataTable = forwardRef<DataTableRef, DataTableProps<any, any>>(
  (
    {
      columns,
      data,
      currentPage,
      totalItems,
      totalPages,
      displayItems,
      displayPageSize,
      onDoubleClickTo,
      showPagination = true,
      isLoading,
    },
    ref
  ) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search") ?? "";
    const itemsPerPage = Number(searchParams.get("limit") ?? 10);

    const isClientPaginate =
      !currentPage || !totalItems || !itemsPerPage || !totalPages;

    console.log(currentPage, "currentPage");
    console.log(isClientPaginate, "isClientPaginate");

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
      {}
    );
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
      data,
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
        globalFilter: searchQuery, // ✅ filter global sync ke query
      },
      // Menetapkan meta untuk server-side pagination
      meta: {
        serverPageIndex: (currentPage ?? 1) - 1,
        serverPageSize: itemsPerPage ?? 10,
      },
    });

    const onDoubleClick = () => {
      if (!onDoubleClickTo) return;
      router.push(onDoubleClickTo);
    };
    const onMouseEnter = () => {
      if (!onDoubleClickTo) return;
      router.prefetch(onDoubleClickTo);
    };

    // publish ke provider kalau ada
    const tableCtx = useOptionalTableProvider();
    useEffect(() => {
      tableCtx?.setTable(table);
      return () => tableCtx?.setTable(null);
    }, [table, tableCtx]);

    // keep forwardRef
    useImperativeHandle(
      ref,
      () => ({
        table,
      }),
      [table]
    );

    // sinkron page size dari props (untuk client-side mode)
    useEffect(() => {
      table.setPageSize(itemsPerPage ?? 5);
    }, [itemsPerPage, table]);

    return (
      <div className="w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-gray-200/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "text-text-900 font-medium",
                        header.column.columnDef.meta?.headerClassName
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 place-items-center"
                  >
                    <SwirlingEffectSpinner />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onDoubleClick={onDoubleClick}
                    onMouseEnter={onMouseEnter}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          cell.column.columnDef.meta?.cellClassName
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {showPagination && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Pagination
              currentPage={
                currentPage ?? table.getState().pagination.pageIndex + 1
              }
              totalItems={totalItems ?? data.length}
              itemsPerPage={
                itemsPerPage ?? table.getState().pagination.pageSize
              }
              totalPages={totalPages ?? table.getPageCount()}
              displayItems={displayItems}
              displayPageSize={displayPageSize}
              onChange={
                isClientPaginate
                  ? ({ page, limit }) => {
                      table.setPageIndex(page - 1);
                      table.setPageSize(limit);
                    }
                  : undefined
              }
            />
          </div>
        )}
      </div>
    );
  }
);

DataTable.displayName = "DataTable";
export default DataTable;
