import {
  useTransformedCities,
  useTransformedDistricts,
  useTransformedProvinces,
  useTransformedVillages,
} from "./useRegions";

export const useRegionData = ({
  provinceCode,
  cityCode,
  districtCode,
}: {
  provinceCode?: string;
  cityCode?: string;
  districtCode?: string;
}) => {
  const provinces = useTransformedProvinces();
  const cities = useTransformedCities(provinceCode);
  const districts = useTransformedDistricts(cityCode);
  const villages = useTransformedVillages(districtCode);

  return {
    provinces,
    cities,
    districts,
    villages,
  };
};
