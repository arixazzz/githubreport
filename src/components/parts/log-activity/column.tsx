import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const logActivityColumns: ColumnDef<LogAcivityResponse>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row, table }) => {
      const pageRows = table.getRowModel().rows;
      const idxInPage = pageRows.findIndex((r) => r.id === row.id);
      const safeIdx = idxInPage >= 0 ? idxInPage : 0;

      const meta = table.options.meta as
        | {
            serverPageIndex?: number;
            serverPageSize?: number;
          }
        | undefined;

      const pageIndex =
        typeof meta?.serverPageIndex === "number"
          ? meta.serverPageIndex
          : table.getState().pagination.pageIndex;

      const pageSize =
        typeof meta?.serverPageSize === "number"
          ? meta.serverPageSize
          : table.getState().pagination.pageSize;

      return pageIndex * pageSize + safeIdx + 1;
    },
  },
  {
    accessorKey: "name", // Assuming you have 'name' as the field for the user's name in the log
    header: "Nama",
    cell: ({ row }) => row.original.user?.nama, // Access the user's name from the related 'user' field
  },
  {
    accessorKey: "timestamp", // Use 'timestamp' or 'createdAt' depending on your field
    header: "Tanggal",
    cell: ({ row }) => formatDate(row.original.timestamp), // Format the 'timestamp' for the date
  },
  {
    accessorKey: "activity", // Assuming you want to show the 'activity' log
    header: "Aktivitas",
    cell: ({ row }) => row.original.activity, // Display the activity field
  },
];
