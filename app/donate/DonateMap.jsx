"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const OPENCAGE_KEY = "c43328d27e38466294cb0d683a51e515";

export default function DonateMap({ form, setForm }) {
  function LocationMarker() {
    const map = useMap();

    useEffect(() => {
      if (!map || typeof window === "undefined") return;

      const reverseGeocode = async (lat, lng) => {
        try {
          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_KEY}`
          );
          if (!res.ok) throw new Error("Reverse geocoding failed");
          const data = await res.json();
          const components = data.results[0]?.components || {};
          const city =
            components.city ||
            components.town ||
            components.village ||
            components.county ||
            "Unknown";
          setForm((p) => ({ ...p, location: city, lat, lng }));
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          setForm((p) => ({ ...p, location: "Unknown", lat, lng }));
        }
      };

      // Auto-detect user location
      navigator.geolocation?.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          map.setView([latitude, longitude], 13);
          reverseGeocode(latitude, longitude);
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );

      const handleClick = (e) => {
        const { lat, lng } = e.latlng;
        map.setView([lat, lng], 13);
        reverseGeocode(lat, lng);
      };

      map.on("click", handleClick);
      return () => map.off("click", handleClick);
    }, [map, setForm]);

    return form.lat && form.lng ? <Marker position={[form.lat, form.lng]} /> : null;
  }

  return (
    <MapContainer
      center={[33.8886, 35.4955]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "250px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LocationMarker />
    </MapContainer>
  );
}