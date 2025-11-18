"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { FieldValues, Path, PathValue, useFormContext } from "react-hook-form";
import * as turf from "@turf/turf";
import { FeatureCollection, Polygon as GeoJsonPolygon } from "geojson";

// Load map dynamically
const GoogleMapComponent = dynamic(
  () => import("@/components/shared/maps/googleMapComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
        Loading map...
      </div>
    ),
  }
);

type CustomFormMapsProps<T extends FieldValues = FieldValues> = {
  nameLat: Path<T>;
  nameLong: Path<T>;
  label?: string;
  className?: string;
  containerClassName?: string;
  geoJson?: FeatureCollection<GeoJsonPolygon, AreaProperties>; // <- geoJson yang diizinkan
  colorMap?: Record<string, string>;
};

export default function CustomFormGmaps<T extends FieldValues = FieldValues>({
  nameLat,
  nameLong,
  label,
  className,
  containerClassName,
  geoJson,
  colorMap,
}: CustomFormMapsProps<T>) {
  const { control, setValue, watch } = useFormContext<T>();
  const [position, setPosition] = useState<[number, number]>([
    -3.2929468, 103.8467967,
  ]);
  const [isClient, setIsClient] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const latitude = watch(nameLat);
  const longitude = watch(nameLong);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        latitude &&
        longitude &&
        !isNaN(Number(latitude)) &&
        !isNaN(Number(longitude))
      ) {
        setPosition([Number(latitude), Number(longitude)]);
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [latitude, longitude]);

  const handlePositionChange = (newPosition: [number, number]) => {
    const point = turf.point([newPosition[1], newPosition[0]]); // lng, lat
    let isInside = true;

    if (geoJson) {
      if (geoJson.type === "FeatureCollection") {
        // cek tiap feature
        isInside = geoJson.features.some((feature) =>
          turf.booleanPointInPolygon(point, feature as any)
        );
      } else if (geoJson.type === "Feature") {
        isInside = turf.booleanPointInPolygon(point, geoJson as any);
      } else {
        // Polygon atau MultiPolygon langsung
        isInside = turf.booleanPointInPolygon(point, geoJson as any);
      }
    }

    if (!isInside) {
      setLocationError("Lokasi di luar area yang diperbolehkan");
      alert("Lokasi di luar area yang diperbolehkan 🚫");
      return;
    }

    setLocationError(null);
    setPosition(newPosition);
    setValue(nameLat, newPosition[0].toString() as PathValue<T, Path<T>>, {
      shouldValidate: true,
    });
    setValue(nameLong, newPosition[1].toString() as PathValue<T, Path<T>>, {
      shouldValidate: true,
    });
  };

  return (
    <div className={cn(className, "w-full")}>
      {label && <FormLabel>{label}</FormLabel>}

      <FormField
        name={nameLat}
        control={control}
        render={() => (
          <FormItem>
            <FormControl>
              <div
                className={cn(
                  "w-full h-96 bg-gray-200 mb-2 rounded-md overflow-hidden relative mt-3",
                  containerClassName
                )}
              >
                {isClient && (
                  <GoogleMapComponent
                    position={position}
                    onPositionChange={handlePositionChange}
                    geoJson={geoJson} // bisa dipakai untuk render polygon juga
                    colorMap={colorMap}
                  />
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {locationError && (
        <div className="text-red-500 text-sm mb-4">Error: {locationError}</div>
      )}
    </div>
  );
}
