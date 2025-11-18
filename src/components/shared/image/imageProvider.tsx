"use client";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

import React from "react";

export function ImageProvider({ children }: { children: React.ReactNode }) {
  return <PhotoProvider> {children}</PhotoProvider>;
}
