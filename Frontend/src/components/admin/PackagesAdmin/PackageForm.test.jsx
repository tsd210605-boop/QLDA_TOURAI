import React from "react";
import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getAllDestinations } from "../../../api/adminApi";
import PackageForm from "./PackageForm";

jest.mock("../../../api/adminApi", () => ({
  createPackage: jest.fn(), getPackageById: jest.fn(),
  updatePackage: jest.fn(), getAllDestinations: jest.fn()
}));

const renderForm = () => render(<MemoryRouter><PackageForm /></MemoryRouter>);
beforeEach(() => jest.clearAllMocks());

test("offers only saved destinations, without adding sample or duplicate locations", async () => {
  getAllDestinations.mockResolvedValue([
    { id: 1, name: "Sa Pa", location: "Sa Pa, Việt Nam", imageUrl: "/images/vietnam/sa-pa.jpg" }
  ]);
  renderForm();
  await screen.findByRole("option", { name: "Sa Pa (Sa Pa, Việt Nam)" });
  const select = screen.getByRole("combobox", { name: /Điểm đến chính/ });
  expect(within(select).getAllByRole("option")).toHaveLength(2);
  expect(screen.queryByRole("option", { name: /Sri Lanka|Kandy|Sapa|Bentota|Ella/i })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Tạo gói tour" })).toBeEnabled();
});

test("does not invent destinations when the database is empty", async () => {
  getAllDestinations.mockResolvedValue([]);
  renderForm();
  expect(await screen.findByText(/Chưa có điểm đến/)).toBeInTheDocument();
  expect(screen.getByRole("combobox", { name: /Điểm đến chính/ })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Tạo gói tour" })).toBeDisabled();
});

test("shows a load failure and prevents saving with an invented destination", async () => {
  getAllDestinations.mockRejectedValue(new Error("Không thể tải điểm đến."));
  renderForm();
  expect(await screen.findByRole("alert")).toHaveTextContent("Không thể tải điểm đến.");
  expect(screen.getByRole("combobox", { name: /Điểm đến chính/ })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Tạo gói tour" })).toBeDisabled();
  expect(screen.queryByRole("option", { name: /Sri Lanka|Sapa|Kandy/i })).not.toBeInTheDocument();
});
