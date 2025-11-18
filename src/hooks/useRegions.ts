import {
  useCities,
  useDistricts,
  useProvinces,
  useVillages,
} from "@/components/parts/regions/api";

export const useTransformedProvinces = () => {
  const { data } = useProvinces();
  return (data?.data || []).map((item) => ({
    label: item.name,
    value: item.code,
    code: item.code,
  }));
};

export const useTransformedCities = (provinceCode?: string) => {
  const { data } = useCities(provinceCode);
  return (data?.data || []).map((item) => ({
    label: item.name,
    type: item.type,
    value: item.id.toString(),
    code: item.code,
    full_code: item.full_code,
  }));
};

export const useTransformedDistricts = (cityCode?: string) => {
  const { data } = useDistricts(cityCode);
  return (data?.data || []).map((item) => ({
    label: item.name,
    value: item.id.toString(),
    code: item.code,
    full_code: item.full_code,
  }));
};

export const useTransformedVillages = (districtCode?: string) => {
  const { data } = useVillages(districtCode);
  return (data?.data || []).map((item) => ({
    label: item.name,
    value: item.id.toString(),
    code: item.code,
    full_code: item.full_code,
  }));
};
