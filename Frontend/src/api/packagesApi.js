import { ENDPOINTS } from "./config";

const BASE_URL = ENDPOINTS.packages;
const DIRECT_URL = "http://localhost:8084/packages";

const safeFetchJson = async (primaryUrl, fallbackUrl) => {
  try {
    const res = await fetch(primaryUrl);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`Primary fetch failed for ${primaryUrl}:`, err);
  }
  if (fallbackUrl) {
    try {
      const res = await fetch(fallbackUrl);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error(`Fallback fetch failed for ${fallbackUrl}:`, e);
    }
  }
  return null;
};

/* -------------------- GET -------------------- */

export const getAllPackages = async () => {
  const data = await safeFetchJson(BASE_URL, DIRECT_URL);
  return Array.isArray(data) ? data : [];
};

export const getPackagesByCategory = async (category) => {
  const encoded = encodeURIComponent(category);
  const data = await safeFetchJson(
    `${BASE_URL}/category/${encoded}`,
    `${DIRECT_URL}/category/${encoded}`
  );
  return Array.isArray(data) ? data : [];
};

export const getPackageById = async (id) => {
  return await safeFetchJson(`${BASE_URL}/${id}`, `${DIRECT_URL}/${id}`);
};

export const getItineraryByPackageId = async (id) => {
  const data = await safeFetchJson(
    `${BASE_URL}/${id}/itinerary`,
    `${DIRECT_URL}/${id}/itinerary`
  );
  return Array.isArray(data) ? data : [];
};

export const getRelatedPackages = async (category, excludeId) => {
  const encoded = encodeURIComponent(category);
  const data = await safeFetchJson(
    `${BASE_URL}/category/${encoded}/related/${excludeId}`,
    `${DIRECT_URL}/category/${encoded}/related/${excludeId}`
  );
  return Array.isArray(data) ? data : [];
};

export const getOffers = async () => {
  const data = await safeFetchJson(`${BASE_URL}/offers`, `${DIRECT_URL}/offers`);
  return Array.isArray(data) ? data : [];
};

export const getPackageOffer = async (packageId) => {
  return await safeFetchJson(
    `${BASE_URL}/${packageId}/offer`,
    `${DIRECT_URL}/${packageId}/offer`
  );
};
