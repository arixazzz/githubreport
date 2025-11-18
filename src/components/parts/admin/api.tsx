import { ProductFormPayload } from "./validation";
import { fetcher, sendData } from "@/services/api/fetcher";
import { useFormMutation } from "@/hooks/useFormMutation";
import { useQuery } from "@tanstack/react-query";

// get
const getProduct = async (
  query?: string
): Promise<ApiResponse<ProductResponse[]>> => {
  const mock = await fetch(`/mock/product.json?${query ?? ""}`);
  return mock.json();
};

export const useGetProduct = (query?: string) => {
  return useQuery<ApiResponse<ProductResponse[]>, Error>({
    queryKey: ["useGetProduct", query],
    queryFn: () => getProduct(query),
  });
};

// get by id
export const getProductId = async (
  id: number
): Promise<ApiResponse<DataObject<ProductResponse>>> => {
  return await fetcher(`infrastruktur/${id}/get`);
};

export const useGetProductId = (id: number) => {
  return useQuery<ApiResponse<DataObject<ProductResponse>>, Error>(
    ["useGetProductId", id],
    () => getProductId(id)
  );
};

// post
export const useProduct = (method: "POST" | "PUT" = "POST", id?: number) => {
  return useFormMutation<
    ApiResponse<DataObject<ProductFormPayload>>,
    Error,
    ProductFormPayload
  >({
    mutationFn: async (
      data
    ): Promise<ApiResponse<DataObject<ProductFormPayload>>> => {
      const endpoint = id
        ? `infrastruktur/${id}/update`
        : "infrastruktur/create";
      const delay = new Promise((resolve) => setTimeout(resolve, 2000));
      const response: ApiResponse<DataObject<ProductFormPayload>> =
        await sendData(endpoint, data, method);
      await delay;
      return response;
    },
    loadingMessage:
      method === "POST" ? "Menyimpan data..." : "Memperbarui data...",
    successMessage:
      method === "POST"
        ? "Data berhasil ditambahkan"
        : "Data berhasil diperbarui",
  });
};
