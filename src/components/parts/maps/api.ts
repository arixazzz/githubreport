import { APIError } from "@/types/interface";
import { Polygon as GeoJsonPolygon } from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";
import { FeatureCollection } from "geojson";

export const useGetGeo = (params?: string) => {
  return useQuery<
    FeatureCollection<GeoJsonPolygon | any, AreaProperties>,
    APIError<string>
  >({
    queryKey: ["useGetGeo", params],
    queryFn: async () => {
      const response = await fetch("/assets/geo/pali-kecamatan.geojson");
      return response.json();
    },
  });
};
