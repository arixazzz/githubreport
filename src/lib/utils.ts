import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Feature, Polygon as GeoJsonPolygon } from "geojson";
import xss from "xss";
import { id as ID } from "date-fns/locale";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date?: string | Date | null) {
  if (!date) return "-";
  return format(date, "EEEE, d MMMM yyyy", { locale: ID });
}

export function formatToMask(format: string): string {
  return format.replace(/[a-zA-Z]/g, "_");
}

export const formatFileName = (name: string) => {
  if (!name) return "Tidak ada nama file";
  const tempName = name?.split("/");
  const newName = tempName[tempName.length - 1];
  return newName;
};

export function formatErrorMessages(
  errorData: Record<string, string[] | string>
): string {
  return Object.entries(errorData)
    .map(([field, messages]) => {
      const readableField = field
        .replace(/([A-Z])/g, " $1") // camelCase to space
        .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter

      const text =
        Array.isArray(messages) && messages.length > 0
          ? messages.map((msg) => `• ${readableField}: ${msg}`).join("\n")
          : `• ${readableField}: ${messages}`;

      return text;
    })
    .join("\n");
}

/**
 * Convert Blob/File ke object URL untuk dipakai di <img src=... />
 * @param blob - File atau Blob valid
 * @returns string | null
 */
export function blobToUrl(blob: Blob | null | undefined): string | null {
  if (!blob) return null;
  if (!(blob instanceof Blob)) {
    console.warn("blobToUrl: input bukan Blob/File =>", blob);
    return null;
  }
  return URL.createObjectURL(blob);
}

export function revokeUrl(url: string | null | undefined) {
  if (url) {
    URL.revokeObjectURL(url);
  }
}

/** Helper: base64URL → Uint8Array (untuk VAPID public key) */
export function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const base64Safe = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64Safe);
  return Uint8Array.from([...raw].map((ch) => ch.charCodeAt(0)));
}

export function arrayBufferToBase64(buf: ArrayBuffer | null) {
  if (!buf) return "";
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

export function cleanHTML(input: string): string {
  return xss(input, {
    whiteList: {},
    stripIgnoreTag: true, // hapus tag yang ga di whitelist
    stripIgnoreTagBody: ["script", "style"], // buang isi script/style juga
  });
}

export const getCoords = (feature: Feature<GeoJsonPolygon, AreaProperties>) => {
  if (feature.geometry.type === "Polygon") {
    return feature.geometry.coordinates[0].map(([lng, lat]) => ({ lat, lng }));
  }
  if (feature.geometry.type === "MultiPolygon") {
    return feature.geometry.coordinates[0][0].map(([lng, lat]: any) => ({
      lat,
      lng,
    }));
  }
  return [];
};

export function getPolygonCenter(coords: google.maps.LatLngLiteral[]) {
  let minLat = coords[0].lat,
    maxLat = coords[0].lat,
    minLng = coords[0].lng,
    maxLng = coords[0].lng;

  coords.forEach(({ lat, lng }) => {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  });

  return {
    lat: (minLat + maxLat) / 2,
    lng: (minLng + maxLng) / 2,
  };
}
