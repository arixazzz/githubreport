import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useDelete } from "../parts/api";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { myAlert } from "@/lib/myAlert";

type ModalDeleteProps = {
  endpoint: string | string[];
  endPointBack?: string;
  queryKey?: string[];
  asMenuItem?: boolean;
};

const ModalDelete = ({
  endpoint,
  endPointBack,
  queryKey,
  asMenuItem,
}: ModalDeleteProps) => {
  const router = useRouter();
  const deleteMutation = useDelete();
  const queryClient = useQueryClient(); // ✅ ambil dari context React Query

  const handleDelete = async () => {
    try {
      const res = await myAlert.confirm(
        "Yakin ingin menghapus!",
        "Data yang dihapus secara permanen tidak dapat dikembalikan"
      );
      if (res) {
        if (Array.isArray(endpoint)) {
          console.log("Deleting multiple:", endpoint);
          await Promise.allSettled(
            endpoint.map((ep) => deleteMutation.mutateAsync({ endpoint: ep }))
          );
        } else {
          console.log("Deleting single:", endpoint);
          await deleteMutation.mutateAsync({ endpoint });
        }

        console.log("Invalidating key:", queryKey);
        if (queryKey) {
          await queryClient.invalidateQueries({ queryKey });
          console.log(
            "Current cache keys:",
            queryClient
              .getQueryCache()
              .getAll()
              .map((q) => q.queryKey)
          );
        }

        if (endPointBack) {
          router.push(endPointBack);
        }
      }
    } catch (error: any) {
      console.error("❌ Error in handleDelete:", error);
    }
  };

  if (asMenuItem) {
    return (
      <DropdownMenuItem
        onClick={handleDelete}
        className="flex items-center gap-2 text-red-600 cursor-pointer"
      >
        <Trash2 className="h-4 w-4" />
        Hapus
      </DropdownMenuItem>
    );
  }

  return (
    <Button size="icon" variant="ghost" onClick={handleDelete}>
      <Trash2 className="text-red-500 !stroke-[3]" />
    </Button>
  );
};

export default ModalDelete;
