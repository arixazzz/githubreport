"use client";

import { useGetGeo } from "@/components/parts/maps/api";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import GisMapView from "@/components/shared/maps/gisMapView";
import GooglePoint from "@/components/shared/maps/googlePoint";

import MapBadgeOverlay from "@/components/shared/maps/mapBadgeOverlay";
import { getCoords, getPolygonCenter } from "@/lib/utils";
import { FeatureCollection, Polygon } from "geojson";
import { useMemo } from "react";

export default function Page() {
  const { data: geo } = useGetGeo();

  // jika mau otomatis
  const mappingBadge = useMemo(() => {
    const dataCoor = geo?.features.map((feature) => {
      const coords = getCoords(feature);
      const centerCoor = getPolygonCenter(coords);
      return { ...feature.properties, position: centerCoor };
    });

    return dataCoor;
  }, [geo]);

  if (!geo) return null;
  return (
    <div>
      <BreadcrumbSetItem
        items={[
          {
            title: "Dashboard",
            href: "/dashboard",
          },
          {
            title: "Maps View",
          },
        ]}
      />
      <div className="w-full h-[600px]">
        <GisMapView
          geoJson={geo}
          onSelected={(e) => console.log(e)}
          colorMap={{
            "Talang Ubi": "#f94144",
            Penukal: "#f3722c",
            Abab: "#f9c74f",
            "Penukal Utara": "#90be6d",
            "Tanah Abang": "#0077b6",
          }}
        >
          {/* untuk point titik */}
          <GooglePoint position={{ lat: -3.2909468, lng: 103.8467967 }}>
            <div className="max-w-lg">
              <p>Tes</p>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga
                mollitia iusto explicabo ea pariatur cupiditate natus ut magni,
                saepe cum voluptatum maiores facere fugit eos voluptas?
                Excepturi minus veniam officiis.
              </p>
            </div>
          </GooglePoint>
          {/* untuk badge overlay */}
          {mappingBadge?.map((data, i) => (
            <MapBadgeOverlay
              key={i}
              position={data.position}
              title={data.nm_kecamatan}
              value={"desc"}
            />
          ))}
        </GisMapView>
      </div>
    </div>
  );
}

type AreaProperties = {
  id: number;
  name: string;
  color: string;
};

const dummyGeoJson: FeatureCollection<Polygon, AreaProperties> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: 1,
        name: "Area Hutan Lindung",
        color: "#4CAF50",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [103.8467967, -3.2909468],
            [103.8567967, -3.2919468],
            [103.8567967, -3.2959468],
            [103.8467967, -3.2969468],
            [103.8467967, -3.2909468], // polygon harus closed
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: 2,
        name: "Area Pemukiman",
        color: "#FF5722",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [103.8467967, -3.3009468],
            [103.8567967, -3.3019468],
            [103.8567967, -3.3059468],
            [103.8467967, -3.3069468],
            [103.8467967, -3.3009468],
          ],
        ],
      },
    },
  ],
};
