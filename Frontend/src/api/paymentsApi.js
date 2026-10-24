import { ENDPOINTS } from "./config";

const PAYMENTS_URL = ENDPOINTS.payments;
const INVOICES_URL = ENDPOINTS.invoices;

export const createPaymentUrl = async ({ bookingId, gateway = "VNPAY", returnUrl }) => {
  const res = await fetch(`${PAYMENTS_URL}/create-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId, gateway, returnUrl }),
  });
  if (!res.ok) throw new Error("Failed to create payment URL");
  return res.json();
};

export const getInvoiceByBookingId = async (bookingId) => {
  const res = await fetch(`${INVOICES_URL}/${bookingId}`);
  if (!res.ok) return null;
  return res.json();
};

export const getPaymentsByBookingId = async (bookingId) => {
  const res = await fetch(`${PAYMENTS_URL}/booking/${bookingId}`);
  if (!res.ok) return [];
  return res.json();
};

export const handlePaymentCallback = async (gateway, params) => {
  const res = await fetch(`${PAYMENTS_URL}/callback/${gateway}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to process payment callback");
  return res.json();
};
