"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import type { MarkerItem } from "@/lib/types";
import { DescripcionExpandible } from "./DescripcionExpandible";
import { TextoEnlazado } from "./TextoEnlazado";

function createPinIcon(color: string, accent = "#fff") {
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 36 48" fill="none">
      <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8.06 27.94 0 18 0z" fill="${color}"/>
      <circle cx="18" cy="18" r="7.5" fill="${accent}"/>
    </svg>
  `);
  return L.icon({
    iconUrl: `data:image/svg+xml,${svg}`,
    iconSize: [24, 32],
    iconAnchor: [12, 30],
    popupAnchor: [0, -28],
  });
}

const pinPrincipal = createPinIcon("#d2f25a", "#0b3a4c");
const pinFormulario = createPinIcon("#3b5bff", "#ffffff");

function FitBounds({ points }: { points: { lat: number; lng: number }[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 14);
      return;
    }
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [48, 48] });
  }, [map, points]);
  return null;
}

function DraggablePin({
  position,
  onMove,
}: {
  position: { lat: number; lng: number };
  onMove: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onMove(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={pinFormulario}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const m = e.target as L.Marker;
          const { lat, lng } = m.getLatLng();
          onMove(lat, lng);
        },
      }}
    />
  );
}

type MapaProps = {
  markers: MarkerItem[];
  className?: string;
  height?: string;
};

export function Mapa({ markers, className = "", height }: MapaProps) {
  const center: [number, number] = useMemo(
    () =>
      markers.length > 0
        ? [markers[0].lat, markers[0].lng]
        : [-34.6037, -58.3816],
    [markers],
  );
  const popupMaxWidth = Math.min(280, window.innerWidth - 72);

  return (
    <div
      className={`mapa-congreso overflow-hidden rounded-2xl ${className}`}
      style={height ? { height } : undefined}
    >
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='Tiles &copy; Esri'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        />
        <FitBounds points={markers} />
        {markers.map((m) => (
          <Marker key={m.key} position={[m.lat, m.lng]} icon={pinPrincipal}>
            <FichaPopup marker={m} maxWidth={popupMaxWidth} />
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

function FichaPopup({
  marker: m,
  maxWidth,
}: {
  marker: MarkerItem;
  maxWidth: number;
}) {
  const popupRef = useRef<L.Popup | null>(null);

  return (
    <Popup
      ref={popupRef}
      className="popup-ficha"
      maxWidth={maxWidth}
      minWidth={Math.min(220, maxWidth)}
      autoPanPaddingTopLeft={[16, 48]}
      autoPanPaddingBottomRight={[16, 16]}
    >
      <div className="popup-ficha__card">
        <div className="popup-ficha__head">
          <p className="popup-ficha__titulo">{m.org.nombre}</p>
        </div>
        <div className="popup-ficha__body">
          <p className="popup-ficha__direccion">
            {m.org.sedes[m.sedeIndex]?.direccion}
          </p>
          {m.org.areas.length > 0 && (
            <div className="popup-ficha__chips">
              {m.org.areas.map((area) => (
                <span key={area} className="popup-ficha__chip">
                  {area}
                </span>
              ))}
            </div>
          )}
          <DescripcionExpandible
            texto={m.org.descripcion}
            className="popup-ficha__descripcion"
            botonClassName="popup-ficha__ver-mas"
            onToggle={() =>
              requestAnimationFrame(() => popupRef.current?.update())
            }
          />
          {(m.org.contacto || m.org.redes) && (
            <div className="popup-ficha__meta">
              {m.org.contacto && (
                <p>
                  <span className="popup-ficha__etiqueta">Contacto</span>
                  <TextoEnlazado texto={m.org.contacto} />
                </p>
              )}
              {m.org.redes && (
                <p>
                  <span className="popup-ficha__etiqueta">Redes</span>
                  <TextoEnlazado texto={m.org.redes} redes />
                </p>
              )}
            </div>
          )}
          {m.org.sedes.length > 1 && (
            <p className="popup-ficha__otras">
              Otras sedes:{" "}
              {m.org.sedes
                .filter((_, i) => i !== m.sedeIndex)
                .map((s) => s.direccion)
                .join(" · ")}
            </p>
          )}
        </div>
      </div>
    </Popup>
  );
}

type PinMapProps = {
  position: { lat: number; lng: number };
  onMove: (lat: number, lng: number) => void;
  className?: string;
};

export function PinMap({ position, onMove, className = "" }: PinMapProps) {
  return (
    <div
      className={`mapa-congreso overflow-hidden rounded-xl ${className}`}
      style={{ height: 220 }}
    >
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={16}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='Tiles &copy; Esri'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        />
        <DraggablePin position={position} onMove={onMove} />
      </MapContainer>
    </div>
  );
}
