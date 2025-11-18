import { Edit, Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import React from "react";
import ModalDelete from "../shared/modalDelete";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type actionOptionPops = {
  linkView?: string;
  linkUpdate?: string;
  linkDelete?: string;
  queryKey?: string[];
  other?: React.ReactNode;
};

export default function ActionOption({
  linkDelete,
  linkUpdate,
  linkView,
  queryKey,
  other,
}: actionOptionPops) {
  const onlyView = linkView && !linkUpdate && !linkDelete && !other;

  if (onlyView) {
    return (
      <Link href={linkView}>
        <Button size="icon" variant="ghost">
          <Eye className="text-info-500 !stroke-[3]" />
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreHorizontal className="!stroke-[3]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {linkView && (
          <DropdownMenuItem asChild>
            <Link
              href={linkView}
              className="flex items-center gap-2 text-info-500"
            >
              <Eye className="h-4 w-4 text-info-500" /> Lihat
            </Link>
          </DropdownMenuItem>
        )}
        {linkUpdate && (
          <DropdownMenuItem asChild>
            <Link href={linkUpdate} className="flex items-center gap-2">
              <Edit className="h-4 w-4" /> Edit
            </Link>
          </DropdownMenuItem>
        )}
        {other}
        {linkDelete && queryKey && (
          <ModalDelete endpoint={linkDelete} queryKey={queryKey} asMenuItem />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
