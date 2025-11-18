"use client";

import React, { Suspense, useEffect } from "react";

export default function ServiceWorkerWarp({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("✅ SW registered"))
        .catch((err) => console.error("SW registration failed:", err));
    }
  }, []);

  return (
    <React.Fragment>
      <Suspense>{children}</Suspense>
    </React.Fragment>
  );
}
