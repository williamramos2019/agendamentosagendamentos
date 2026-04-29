import { useEffect, useState } from "react";

export interface CustomerLocation {
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  state?: string;
  distanceKm: number;
}

type LocationStatus = "idle" | "requesting" | "allowed" | "denied" | "unavailable";

const STORAGE_KEY = "cleanpro_customer_location_v1";
const COMPANY_LOCATION = { latitude: -19.6993, longitude: -43.9582 };

function distanceInKm(from: Pick<CustomerLocation, "latitude" | "longitude">) {
  const earthRadiusKm = 6371;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(from.latitude - COMPANY_LOCATION.latitude);
  const dLon = toRad(from.longitude - COMPANY_LOCATION.longitude);
  const lat1 = toRad(COMPANY_LOCATION.latitude);
  const lat2 = toRad(from.latitude);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return Math.round(earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

async function reverseGeocode(latitude: number, longitude: number) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      { headers: { Accept: "application/json" } }
    );
    if (!response.ok) throw new Error("Reverse geocoding failed");
    const data = await response.json();
    const address = data.address ?? {};
    const city = address.city ?? address.town ?? address.village ?? address.suburb;
    return {
      address: data.display_name ?? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
      city,
      state: address.state,
    };
  } catch {
    return { address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` };
  }
}

function loadSavedLocation() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as CustomerLocation) : null;
  } catch {
    return null;
  }
}

export function useCustomerLocation() {
  const [location, setLocation] = useState<CustomerLocation | null>(() => loadSavedLocation());
  const [status, setStatus] = useState<LocationStatus>(() => (loadSavedLocation() ? "allowed" : "idle"));

  useEffect(() => {
    if (location || status !== "idle") return;
    if (!navigator.geolocation) {
      setStatus("unavailable");
      return;
    }

    setStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const geo = await reverseGeocode(coords.latitude, coords.longitude);
        const nextLocation: CustomerLocation = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          address: geo.address,
          city: geo.city,
          state: geo.state,
          distanceKm: distanceInKm(coords),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLocation));
        setLocation(nextLocation);
        setStatus("allowed");
      },
      () => setStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 10 * 60 * 1000 }
    );
  }, [location, status]);

  return { location, status };
}