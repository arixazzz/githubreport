import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import ModalDelete from "@/components/shared/modalDelete";
import Image from "next/image";
import ActionOption from "@/components/table/actionOption";

export const dummyUser = [
  {
    id: "1",
    nama: "Admin",
    email: "admin@gmail.com",
    role: "Administrator",
  },
  {
    id: "2",
    nama: "Admin",
    email: "admin@gmail.com",
    role: "Administrator",
  },
  {
    id: "3",
    nama: "User",
    email: "User@gmail.com",
    role: "User",
  },
];

export const ManajemenUserColumns: ColumnDef<ManajemenUserInterface>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => row.original.id,
  },
  {
    accessorKey: "nama",
    header: "Nama",
    cell: ({ row }) => row.original.nama,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => row.original.role,
  },
  {
    accessorKey: "action",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="">
        <Link
          className="text-yellow-500"
          href={`/manajemen-user/edit/${row.original.id}`}
        >
          Edit
        </Link>
        {" | "}
        <Link
          className="text-yellow-500"
          href={`/manajemen-user/hapus/${row.original.id}`}
        >
          hapus
        </Link>
      </div>
    ),
  },
];
