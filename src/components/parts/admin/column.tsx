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

export const productColumns: ColumnDef<ProductResponse>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => row.original.id,
  },
  {
    accessorKey: "productName",
    header: "Nama Produk",
    cell: ({ row }) => row.original.productName,
  },
  {
    accessorKey: "imageUrl",
    header: "Gambar Produk",
    cell: ({ row }) => {
      return (
        <Image
          src={row.original.imageUrl}
          width={90}
          height={90}
          alt="pic"
          className="aspect-square object-cover"
        />
      );
    },
  },
  {
    accessorKey: "category",
    header: "Kategori",
    cell: ({ row }) => row.original.category,
  },
  {
    accessorKey: "price",
    header: "Harga",
    cell: ({ row }) =>
      `Rp${Number(row.original.price).toLocaleString("id-ID")}`,
  },
  {
    accessorKey: "isAvailable",
    header: "Ketersediaan",
    cell: ({ row }) => (row.original.isAvailable ? "Tersedia" : "Tidak"),
  },
  {
    accessorKey: "action",
    header: "Aksi",
    cell: ({ row }) => <ActionOption />,
  },
];
