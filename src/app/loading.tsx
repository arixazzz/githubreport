"use client";

import SwirlingEffectSpinner from "@/components/shared/swirlingEffectSpinner";
import React from "react";

export default function Loading() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <SwirlingEffectSpinner />
    </div>
  );
}
