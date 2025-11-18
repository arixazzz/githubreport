"use client";

import { getCoords } from "@/lib/utils";
import { GoogleMap, Polygon } from "@react-google-maps/api";
import type {
  Feature,
  FeatureCollection,
  Polygon as GeoJsonPolygon,
} from "geojson";
import React, { useState } from "react";
import { useGoogleMapsLoader } from "./gmapsLoader";

const containerStyle = {
  width: "100%",
  height: "100%",
};

type GisMapViewProps = {
  geoJson?: FeatureCollection<GeoJsonPolygon, AreaProperties>;
  children?: React.ReactNode;
  onSelected?: (data: Feature<GeoJsonPolygon, AreaProperties>) => void;
  selected?: Feature<GeoJsonPolygon, AreaProperties>;
  colorMap?: Record<string, string>;
  center?: google.maps.LatLngLiteral;
  handleClick?: (e: google.maps.MapMouseEvent) => void;
  handleClicPolygon?: (e: google.maps.MapMouseEvent) => void;
  zoom?: number;
  mapRef?: (e: google.maps.Map | null) => void;
  onLoad?: (e: google.maps.Map | null) => void;
};

export default function GisMapView({
  geoJson,
  children,
  onSelected,
  colorMap,
  selected,
  center = { lat: -3.2929468, lng: 103.8467967 },
  zoom = 10,
  handleClick,
  handleClicPolygon,
  mapRef,
  onLoad,
}: GisMapViewProps) {
  const { isLoaded } = useGoogleMapsLoader();
  const [hovered, setHovered] = useState<string | null>(null);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapZoom, setMapZoom] = useState(zoom);

  const getColor = (name: string): string => {
    if (hovered) {
      return hovered === name ? colorMap?.[name] || "#f59e0b" : "#00000055";
    }
    if (!selected) return colorMap?.[name] || "#ccc";
    return selected.properties.nm_kecamatan === name
      ? colorMap?.[name] || "#ccc"
      : "#00000055";
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
        Loading map...
      </div>
    );
  }

  return (
    <GoogleMap
      onLoad={(mapInstance) => {
        setMap(mapInstance);
        onLoad?.(mapInstance);
        mapInstance.setCenter(center);
        mapRef?.(mapInstance);
      }}
      onZoomChanged={() => {
        if (map) {
          setMapZoom(map.getZoom() || zoom);
        }
      }}
      mapContainerStyle={containerStyle}
      zoom={zoom}
      options={{
        fullscreenControl: false,
      }}
      onClick={handleClick}
    >
      {geoJson &&
        mapZoom <= 13.5 && // 👉 kalau zoom <= 11 baru render polygon
        geoJson.features.map(
          (feature: Feature<GeoJsonPolygon, AreaProperties>) => {
            const coords = getCoords(feature);
            const name = feature.properties.nm_kecamatan;

            return (
              <Polygon
                key={feature.properties.kd_kecamatan}
                paths={coords}
                options={{
                  fillColor: getColor(name),
                  fillOpacity: 0.45,
                  strokeColor:
                    hovered === name ? colorMap?.[name] || "#f59e0b" : "#666",
                  strokeOpacity: 0.9,
                  strokeWeight: hovered === name ? 3 : 2,
                }}
                onClick={(e) => {
                  handleClick?.(e);
                  handleClicPolygon?.(e);
                  onSelected?.(feature);
                }}
                onMouseOver={() => setHovered(name)}
                onMouseOut={() => setHovered(null)}
              />
            );
          }
        )}
      {children}
    </GoogleMap>
  );
}
