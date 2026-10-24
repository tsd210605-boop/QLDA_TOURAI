const trimSlash = (url) => (url || "").replace(/\/$/, "");

const API_BASE = trimSlash(process.env.REACT_APP_API_URL || "http://localhost:8080");

export const API = {
  AUTH: API_BASE,
  BOOKINGS: API_BASE,
  DESTINATIONS: API_BASE,
  PACKAGES: API_BASE,
};

// Full path helpers
export const ENDPOINTS = {
  bookings: `${API_BASE}/bookings`,
  destinations: `${API_BASE}/api/destinations`,
  packages: `${API_BASE}/packages`,
  adminPackages: `${API_BASE}/api/admin/packages`,
  adminDestinations: `${API_BASE}/api/admin/destinations`,
  adminBookings: `${API_BASE}/api/admin/bookings`,
  adminItineraries: `${API_BASE}/admin/packages`,
  payments: `${API_BASE}/payments`,
  invoices: `${API_BASE}/invoices`,
  operations: `${API_BASE}/operations`,
  suppliers: `${API_BASE}/suppliers`,
};
