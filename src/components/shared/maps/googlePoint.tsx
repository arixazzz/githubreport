"use client";

import { InfoWindow, Marker, MarkerClusterer } from "@react-google-maps/api";
import { useState } from "react";

import ReactDOMServer from "react-dom/server";

type PointProps = {
  position: google.maps.LatLngLiteral;
  children?: React.ReactNode;
  clusterer?: MarkerClusterer | any;
  onClick?: (id?: number) => void;
  onCloseClick?: () => void;
  id?: number;
  icon?: JSX.Element;
};

function jsxToDataUrl(svg: JSX.Element): string {
  // eslint-disable-next-line testing-library/render-result-naming-convention
  const markup = ReactDOMServer.renderToStaticMarkup(svg); // ⬅️ rename dari svgString → markup
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
}

export default function GooglePoint({
  position,
  children,
  clusterer,
  onClick,
  onCloseClick,
  id,
  icon,
}: PointProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Marker
        clusterer={clusterer}
        position={position}
        onClick={() => {
          if (children) {
            setOpen(true);
          }
          onClick?.(id);
        }}
        icon={{
          url: jsxToDataUrl(
            icon ? (
              icon
            ) : (
              <svg
                width="36"
                height="43"
                viewBox="0 0 36 43"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.54938 5.88293C8.8632 2.61919 13.329 0.791718 17.9802 0.796066C22.6385 0.796066 27.1102 2.6225 30.4109 5.88293C33.3998 8.83152 34.9569 12.1323 35.3684 15.5603C35.7778 18.9586 35.046 22.3696 33.6501 25.5685C30.8797 31.9324 25.3729 37.7193 20.0908 41.4846C19.4752 41.9251 18.7372 42.1619 17.9802 42.1619C17.2232 42.1619 16.4851 41.9251 15.8695 41.4846C10.5874 37.7193 5.08057 31.9303 2.30804 25.5685C0.914354 22.3696 0.184629 18.9586 0.591917 15.5581C1.00345 12.1323 2.56048 8.83364 5.54938 5.88293ZM12.1466 17.2361C12.1466 15.6889 12.7612 14.2051 13.8552 13.1111C14.9492 12.0171 16.433 11.4025 17.9802 11.4025C19.5273 11.4025 21.0111 12.0171 22.1051 13.1111C23.1991 14.2051 23.8137 15.6889 23.8137 17.2361C23.8137 18.7832 23.1991 20.267 22.1051 21.361C21.0111 22.455 19.5273 23.0696 17.9802 23.0696C16.433 23.0696 14.9492 22.455 13.8552 21.361C12.7612 20.267 12.1466 18.7832 12.1466 17.2361Z"
                  fill="#597445"
                />
                <path
                  d="M26 19C26 23.993 20.461 29.193 18.601 30.799C18.4277 30.9293 18.2168 30.9998 18 30.9998C17.7832 30.9998 17.5723 30.9293 17.399 30.799C15.539 29.193 10 23.993 10 19C10 16.8783 10.8429 14.8434 12.3431 13.3431C13.8434 11.8429 15.8783 11 18 11C20.1217 11 22.1566 11.8429 23.6569 13.3431C25.1571 14.8434 26 16.8783 26 19Z"
                  stroke="#F1F1F1"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z"
                  stroke="#F1F1F1"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            )
          ),
          scaledSize: new google.maps.Size(36, 43),
          anchor: new google.maps.Point(18, 42),
        }}
      />
      {open && (
        <InfoWindow
          position={position}
          onCloseClick={() => {
            onCloseClick?.();
            setOpen(false);
          }}
        >
          {children}
        </InfoWindow>
      )}
    </>
  );
}
