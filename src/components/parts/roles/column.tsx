import ActionOption from "@/components/table/actionOption";
import { ColumnDef } from "@tanstack/react-table";

export const rolesColumns: ColumnDef<RolesResponse>[] = [
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
    accessorKey: "Role",
    header: "Role",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "Aksi",
    header: "Aksi",
    meta: {
      cellClassName: "text-center w-10",
      headerClassName: "text-center w-10",
    },
    cell: ({ row }) => {
      return (
        <ActionOption
          linkView={`/roles/detail/${row.original.id}`}
          linkUpdate={`/roles/update/${row.original?.id}`}
          linkDelete={`master/role/${row.original.id}`}
          queryKey={["useGetRoles"]}
        />
      );
    },
  },
];
