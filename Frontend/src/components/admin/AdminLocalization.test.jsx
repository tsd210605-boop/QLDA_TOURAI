import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getAllPackages } from "../../api/adminApi";
import Sidebar from "./Sidebar";
import PackagesList from "./PackagesAdmin/PackagesList";

jest.mock("../../api/adminApi", () => ({ getAllPackages: jest.fn(), deletePackage: jest.fn() }));

test("shows Tourism, Vietnamese navigation, translated category and VND prices", async () => {
  localStorage.clear();
  localStorage.setItem("role", "ADMIN");
  getAllPackages.mockResolvedValue([{ packageId: 4, title: "Tour Sa Pa", category: "Nature & Adventure", duration: "3 days", price: 4680000, peopleCount: 12 }]);
  render(<MemoryRouter initialEntries={["/admin/packages"]}><Sidebar /><PackagesList /></MemoryRouter>);
  expect(await screen.findByText("Tour Sa Pa")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Tourism" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Tổng quan" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Tour du lịch" })).toBeInTheDocument();
  expect(screen.getByText("Thiên nhiên và khám phá")).toBeInTheDocument();
  expect(screen.getByText(/3 ngày/)).toBeInTheDocument();
  expect(screen.getByText(/4.680.000 đ/)).toBeInTheDocument();
  expect(screen.queryByText(/TravelBook|Tour Packages|\$4680000/)).not.toBeInTheDocument();
  localStorage.clear();
});
