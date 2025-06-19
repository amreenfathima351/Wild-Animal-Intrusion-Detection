import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

function ResizeMap() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }, [map]);
  return null;
}

export default function MapDisplay({ location, area }) {
  if (!location) return null;

  const { lat, lon } = location;

  return (
    <div className="relative z-10 w-full h-64 rounded-lg overflow-hidden shadow-md border">
      <MapContainer
        center={[lat, lon]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <ResizeMap />
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]}>
          <Popup>📍 {area || "Your Current Location"}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
