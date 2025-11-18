"use client";

import {
  DrawingManager,
  GoogleMap,
  Marker,
  Polygon,
} from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { useGoogleMapsLoader } from "../maps/gmapsLoader";
import GoogleMapSearchBox from "../maps/googleMapsSearchBox";
import GoogleCurrentLocationButton from "../maps/googleCurrentLocationButton";

const containerStyle = {
  width: "100%",
  height: "500px",
};

type CustomFormMapsProps<T extends FieldValues = FieldValues> = {
  name: Path<T>;
  label?: string;
  className?: string;
  containerClassName?: string;
  center?: { lat: number; lng: number };
};

export default function CustomFormGmapsPoligon<
  T extends FieldValues = FieldValues,
>({
  name,
  label,
  className,
  center,
  containerClassName,
}: CustomFormMapsProps<T>) {
  const { control, setValue } = useFormContext<T>();
  const { isLoaded } = useGoogleMapsLoader();
  const [centerMaps, setCenterMaps] = useState({
    lat: -3.2929468,
    lng: 103.8467967,
  });

  const [polygonPath, setPolygonPath] = useState<[number, number][]>([]);
  const polygonRef = useRef<any>(null);
  const listenersRef = useRef<any>([]);

  // update path ke state + form
  const updatePolygonPath = useCallback(
    (path: google.maps.MVCArray<google.maps.LatLng>) => {
      const newPath = path
        .getArray()
        .map((latlng): [number, number] => [latlng.lat(), latlng.lng()]);
      console.log({ newPath });
      setPolygonPath(newPath);
      setValue(name as Path<T>, newPath as any, { shouldValidate: true });
    },
    [setValue, name]
  );

  // kalau selesai gambar polygon
  const onPolygonComplete = useCallback(
    (polygon: google.maps.Polygon) => {
      updatePolygonPath(polygon.getPath());

      // pasang listener untuk drag vertex
      polygon
        .getPath()
        .addListener("set_at", () => updatePolygonPath(polygon.getPath()));
      polygon
        .getPath()
        .addListener("insert_at", () => updatePolygonPath(polygon.getPath()));
      polygon
        .getPath()
        .addListener("remove_at", () => updatePolygonPath(polygon.getPath()));

      // hapus polygon dari DrawingManager (biar kita render manual)
      polygon.setMap(null);

      console.log;
    },
    [updatePolygonPath]
  );
  const onEdit = useCallback(() => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map((latLng: any) => [latLng.lat(), latLng.lng()] as [number, number]);

      setPolygonPath(nextPath); // ✅ update state untuk tampilan
      setValue(name, nextPath as any, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      }); // ✅ update form
    }
  }, [setValue, name]);

  const onLoad = useCallback(
    (polygon: any) => {
      polygonRef.current = polygon;
      const path = polygon.getPath();
      listenersRef.current.push(
        path.addListener("set_at", onEdit),
        path.addListener("insert_at", onEdit),
        path.addListener("remove_at", onEdit)
      );
    },
    [onEdit]
  );

  const onUnmount = useCallback(() => {
    listenersRef.current.forEach((lis: any) => lis.remove());
    polygonRef.current = null;
  }, []);

  useEffect(() => {
    if (center) {
      setCenterMaps(center);
    }
  }, [center]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <Controller
      name={name as Path<T>}
      control={control}
      render={() => (
        <div className={containerClassName ?? "w-full h-[500px]"}>
          {label && <p className="mb-2 font-medium">{label}</p>}
          <div className="relative">
            <GoogleMapSearchBox
              onPlaceSelected={(lat, lng) => setCenterMaps({ lat, lng })}
            />

            <GoogleMap
              mapContainerStyle={containerStyle}
              center={centerMaps}
              zoom={14}
              options={{ fullscreenControl: false }}
            >
              <DrawingManager
                onPolygonComplete={onPolygonComplete}
                options={{
                  drawingControl: true,
                  drawingControlOptions: {
                    drawingModes: ["polygon"] as any,
                    position: window.google.maps.ControlPosition.TOP_CENTER,
                  },
                  polygonOptions: {
                    fillOpacity: 0.4,
                    strokeWeight: 2,
                  },
                }}
              />

              {polygonPath.length > 0 && (
                <Polygon
                  paths={polygonPath.map(([lat, lng]) => ({ lat, lng }))}
                  options={{
                    fillColor: "#00ff00",
                    fillOpacity: 0.4,
                    strokeColor: "#00aa00",
                    strokeWeight: 2,
                  }}
                  editable
                  onMouseUp={onEdit} // update pas selesai drag
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                />
              )}
            </GoogleMap>

            <div className="absolute bottom-7 right-20 z-[999]">
              <GoogleCurrentLocationButton
                onLocationSuccess={([lat, lng]) => setCenterMaps({ lat, lng })}
              />
            </div>
          </div>
        </div>
      )}
    />
  );
}
