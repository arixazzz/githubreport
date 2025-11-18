"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useMobile";
import { Loader2, MapPin } from "lucide-react";
import React, { useState } from "react";

type CurrentLocationButtonProps = {
  onLocationSuccess: (coords: [number, number]) => void;
  onLocationError?: (err: string) => void;
  className?: string;
};

export default function GoogleCurrentLocationButton({
  onLocationSuccess,
  onLocationError,
  className,
}: CurrentLocationButtonProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const isMobile = useIsMobile();

  const getCurrentLocation = () => {
    setIsGettingLocation(true);

    if (!navigator.geolocation) {
      const msg = "Geolocation is not supported by your browser";
      onLocationError?.(msg);
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationSuccess([latitude, longitude]);
        setIsGettingLocation(false);
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "User denied the request for Geolocation";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get user location timed out";
            break;
        }
        onLocationError?.(errorMessage);
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={getCurrentLocation}
      disabled={isGettingLocation}
      className={`flex items-center gap-2 text-sm ${className || ""}`}
    >
      {isGettingLocation ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {!isMobile && <span>Mendapatkan lokasi...</span>}
        </>
      ) : (
        <>
          <MapPin className="h-4 w-4" />
          {!isMobile && <span>Gunakan Lokasi Saat Ini</span>}
        </>
      )}
    </Button>
  );
}
