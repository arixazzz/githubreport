"use client";

import { useJsApiLoader } from "@react-google-maps/api";

export const GOOGLE_LIBRARIES = ["places", "drawing"] as const;

export const useGoogleMapsLoader = () =>
  useJsApiLoader({
    id: "google-maps-script", // konsisten di semua tempat
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: [...GOOGLE_LIBRARIES],
    language: "id",
    region: "ID",
    version: "weekly",
  });
