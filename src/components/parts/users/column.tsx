import ActionOption from "@/components/table/actionOption";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { LockKeyhole } from "lucide-react";
import Link from "next/link";

export const usersColumns: ColumnDef<UsersResponse>[] = [
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
    accessorKey: "Nama",
    header: "Nama",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "Role",
    header: "Role",
    cell: ({ row }) => row.original.role?.name,
  },
  {
    accessorKey: "Jenis Kelamin",
    header: "Jenis Kelamin",
    cell: ({ row }) =>
      row.original.gender === "MALE" ? "Laki-laki" : "Perempuan",
  },
  {
    accessorKey: "Aksi",
    header: "Aksi",
    meta: {
      cellClassName: "w-10 text-center",
      headerClassName: "w-10 text-center",
    },
    cell: ({ row }) => {
      return (
        <ActionOption
          linkView={`/users/detail/${row.original.id}`}
          linkUpdate={`/users/update/${row.original?.id}`}
          linkDelete={`configuration/user/${row.original.id}/soft`}
          queryKey={["useGetUsers"]}
          other={
            <DropdownMenuItem asChild>
              <Link
                href={`/users?editPassword=${row.original?.id}`}
                className="flex items-center gap-2 text-secondary-700"
              >
                <LockKeyhole className="text-secondary-700 !stroke-[3]" />
                Update Password
              </Link>
            </DropdownMenuItem>
          }
        />
      );
    },
  },
];
