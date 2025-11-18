"use client";

import { OverlayView } from "@react-google-maps/api";
import React from "react";

type MapBadgeOverlayProps = {
  position: google.maps.LatLngLiteral;
  title: string;
  value: string | number;
  color?: string;
};

export default function MapBadgeOverlay({
  position,
  title,
  value,
  color = "#d62828",
}: MapBadgeOverlayProps) {
  return (
    <React.Fragment>
      <OverlayView
        position={position}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      >
        <div className="wrapper">
          <div className="badge">
            <div className="badge_title" style={{ background: color }}>
              {title}
            </div>
            <div className="badge_value">{value}</div>
          </div>
          <div
            className="badge_dot"
            style={{
              background: color,
              boxShadow: `0 0 0 2px ${color}40`, // 40 = 25% opacity
            }}
          ></div>
        </div>
      </OverlayView>
      <style jsx>{`
        .wrapper {
          pointer-events: none;
          position: absolute;
          transform: translate(-50%, -100%);
        }
        .badge {
          display: inline-flex;
          flex-direction: column;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
          transform: translateY(-8px);
        }
        .badge_title {
          color: #fff;
          font-weight: 700;
          font-size: 12px;
          padding: 6px 10px 4px;
          text-align: center;
          white-space: nowrap;
        }
        .badge_value {
          background: #fff;
          color: #1f2937;
          font-weight: 600;
          font-size: 12px;
          padding: 6px 10px 7px;
          text-align: center;
          white-space: nowrap;
        }
        .badge_dot {
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          margin: 6px auto 0 auto;
        }
      `}</style>
    </React.Fragment>
  );
}
