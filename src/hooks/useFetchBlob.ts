import { toast } from "@/lib/myToast";
import { fetchBlob } from "@/services/api/fetcher";
import { useMutation } from "@tanstack/react-query";

async function fetchWithFilename(
  url: string
): Promise<{ blob: Blob; filename?: string }> {
  const response = await fetchBlob(url);
  const blob = await response.blob();

  // Ambil filename dari header Content-Disposition
  const disposition =
    response.headers.get("Content-Disposition") ||
    response.headers.get("content-disposition") ||
    "";

  let filename: string | undefined = undefined;

  if (disposition) {
    const filenameStarMatch = disposition.match(
      /filename\*\s*=\s*UTF-8''([^;]+)/i
    );
    const filenameMatch = disposition.match(
      /filename\s*=\s*["']?([^"';]+)["']?/i
    );

    if (filenameStarMatch && filenameStarMatch[1]) {
      filename = decodeURIComponent(filenameStarMatch[1]);
    } else if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1];
    }
  }

  console.log("Parsed filename:", filename);

  return { blob, filename };
}

export default function useFetchBlob() {
  const downloadMutation = useMutation<
    { blob: Blob; filename?: string },
    Error,
    string
  >({ mutationFn: fetchWithFilename });

  const handleDownload = (url: string) => {
    downloadMutation.mutate(url, {
      onSuccess: ({ blob, filename }) => {
        const urlBlob = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = urlBlob;
        if (filename) {
          link.download = filename;
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(urlBlob);
      },
      onError: (error) => {
        console.error(error);
        toast.error(`Gagal mengunduh file: ${error.message}`);
      },
    });
  };

  return {
    handleDownload,
    isLoading: downloadMutation.isPending,
  };
}
