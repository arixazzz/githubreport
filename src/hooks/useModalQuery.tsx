import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export function useModalQuery(modalKey: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const modalParam = searchParams.get("modal");

  const { type, id } = useMemo(() => {
    if (!modalParam) return { type: null, id: null };
    const [t, i] = modalParam.split(":");
    return { type: t, id: i || null };
  }, [modalParam]);

  const isOpen = type === modalKey;
  const isEdit = isOpen && Boolean(id);

  const replaceWithParams = (nextParams: URLSearchParams) => {
    const q = nextParams.toString();
    // Selalu gunakan format dengan ? bahkan jika query kosong, untuk memastikan URL terbentuk dengan benar
    const newUrl = `${pathname}${q ? `?${q}` : ""}`;
    router.replace(newUrl, { scroll: false });
  };

  const openModal = (id?: string | number) => {
    // Buat URLSearchParams baru dari searchParams yang ada untuk mempertahankan semua params lain
    const params = new URLSearchParams();

    // Copy semua params yang sudah ada
    searchParams.forEach((value, key) => {
      params.set(key, value);
    });

    // Set parameter modal
    params.set("modal", id ? `${modalKey}:${id}` : modalKey);

    replaceWithParams(params);
  };

  const closeModal = () => {
    // Buat URLSearchParams baru dari searchParams yang ada untuk mempertahankan semua params lain
    const params = new URLSearchParams();

    // Copy semua params yang sudah ada
    searchParams.forEach((value, key) => {
      params.set(key, value);
    });

    // Hanya hapus parameter modal, params lain tetap ada
    params.delete("modal");

    replaceWithParams(params);
  };

  return {
    modalParam,
    type,
    id,
    isOpen,
    isEdit,
    openModal,
    closeModal,
    // Export function untuk membuat URL modal
    createModalUrl: (id?: string | number) => {
      const params = new URLSearchParams();
      searchParams.forEach((value, key) => {
        params.set(key, value);
      });
      params.set("modal", id ? `${modalKey}:${id}` : modalKey);
      const q = params.toString();
      return q ? `?${q}` : "?modal=" + (id ? `${modalKey}:${id}` : modalKey);
    },
  };
}
