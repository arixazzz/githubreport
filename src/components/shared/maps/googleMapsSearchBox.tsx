"use client";

import { Autocomplete } from "@react-google-maps/api";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import React, { useRef, useState } from "react";

type SearchBoxProps = {
  onPlaceSelected: (lat: number, lng: number) => void;
};

export default function GoogleMapSearchBox({
  onPlaceSelected,
}: SearchBoxProps) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place || !place.geometry) return;
    const lat = place.geometry.location?.lat();
    const lng = place.geometry.location?.lng();
    if (lat && lng) {
      onPlaceSelected(lat, lng);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handlePlaceChanged();
    }
  };

  return (
    <div className="absolute top-14 left-3 z-10">
      {!showSearch ? (
        <button
          onClick={() => setShowSearch(true)}
          className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
        >
          <Search className="w-5 h-5 text-gray-600" />
        </button>
      ) : (
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-2 rounded-md shadow w-96 lg:w-[45rem] flex flex-col gap-2"
            >
              <Autocomplete
                onLoad={(ac) => (autocompleteRef.current = ac)}
                onPlaceChanged={handlePlaceChanged}
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Cari lokasi..."
                  onKeyDown={handleKeyDown}
                  className="w-full px-3 py-2 rounded-md border shadow-sm focus:outline-none focus:ring focus:border-blue-400 text-sm"
                />
              </Autocomplete>
              <button
                onClick={() => setShowSearch(false)}
                className="flex items-center gap-1 text-xs text-red-500 hover:underline self-end"
              >
                <X className="w-3 h-3" />
                Tutup
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
