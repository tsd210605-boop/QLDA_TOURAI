import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import { getPackageById, getPackageOffer } from "../../api/packagesApi";
import PackageBookingForm from "./PackageBookingForm";

jest.mock("../../api/packagesApi", () => ({ getPackageById: jest.fn(), getPackageOffer: jest.fn() }));
jest.mock("../../api/bookingsApi", () => ({ createBooking: jest.fn() }));
jest.mock("../../api/paymentsApi", () => ({ createPaymentUrl: jest.fn(), getInvoiceByBookingId: jest.fn(), handlePaymentCallback: jest.fn() }));

beforeEach(() => {
  jest.clearAllMocks();
  getPackageById.mockResolvedValue({ packageId: 4, title: "Tour Sa Pa", duration: "3 days", price: 4680000, peopleCount: 2 });
});
const renderBooking = () => render(
  <MemoryRouter initialEntries={["/bookings/package/4"]}>
    <Route path="/bookings/package/:id"><PackageBookingForm /></Route>
  </MemoryRouter>
);

test("shows the VND total for two guests without multiplying by the old exchange rate", async () => {
  getPackageOffer.mockResolvedValue(null);
  renderBooking();
  const total = await screen.findByLabelText("Tổng tiền thanh toán dự kiến:");
  await waitFor(() => expect(total).toHaveValue("9.360.000 đ"));
  expect(screen.getByText(/4.680.000 đ/)).toBeInTheDocument();
  expect(screen.getByText(/3 ngày/)).toBeInTheDocument();
});

test("keeps the discount and total in VND", async () => {
  getPackageOffer.mockResolvedValue({ discountPercentage: 10 });
  renderBooking();
  const total = await screen.findByLabelText("Tổng tiền thanh toán dự kiến:");
  await waitFor(() => expect(total).toHaveValue("8.424.000 đ"));
  expect(screen.getByText(/4.212.000 đ/)).toBeInTheDocument();
});
