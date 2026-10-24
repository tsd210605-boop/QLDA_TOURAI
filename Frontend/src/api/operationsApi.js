import { ENDPOINTS } from "./config";

const OPERATIONS_URL = ENDPOINTS.operations;
const SUPPLIERS_URL = ENDPOINTS.suppliers;

export const getAllDepartures = async () => {
  const res = await fetch(`${OPERATIONS_URL}/tours`);
  if (!res.ok) throw new Error("Failed to load departures");
  return res.json();
};

export const getDepartureById = async (depId) => {
  const res = await fetch(`${OPERATIONS_URL}/tours/${depId}`);
  if (!res.ok) throw new Error("Failed to load departure");
  return res.json();
};

export const dispatchTour = async (depId, dispatchData) => {
  const res = await fetch(`${OPERATIONS_URL}/tours/${depId}/dispatch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dispatchData),
  });
  if (!res.ok) throw new Error("Failed to dispatch tour");
  return res.json();
};

export const bookSupplierForTour = async (depId, supplierBookingData) => {
  const res = await fetch(`${OPERATIONS_URL}/tours/${depId}/book-supplier`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(supplierBookingData),
  });
  if (!res.ok) throw new Error("Failed to book supplier for tour");
  return res.json();
};

export const getTourAllocations = async (depId) => {
  const res = await fetch(`${OPERATIONS_URL}/tours/${depId}/allocations`);
  if (!res.ok) return [];
  return res.json();
};

export const getAllSuppliers = async () => {
  const res = await fetch(SUPPLIERS_URL);
  if (!res.ok) throw new Error("Failed to load suppliers");
  return res.json();
};

export const createSupplier = async (supplierData) => {
  const res = await fetch(SUPPLIERS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(supplierData),
  });
  if (!res.ok) throw new Error("Failed to create supplier");
  return res.json();
};
