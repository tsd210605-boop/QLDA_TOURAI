import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import { getPackageById, getPackageItineraries, addItinerary, deleteItinerary } from "../../../api/adminApi";
import PackageItineraries from "./PackageItineraries";

jest.mock("../../../api/adminApi", () => ({
  getPackageById: jest.fn(), getPackageItineraries: jest.fn(),
  addItinerary: jest.fn(), deleteItinerary: jest.fn()
}));

const item = (day) => ({ itineraryId: day, dayNumber: day, description: `Activities ${day}` });
const renderPage = () => render(
  <MemoryRouter initialEntries={["/admin/packages/7/itineraries"]}>
    <Route path="/admin/packages/:id/itineraries"><PackageItineraries /></Route>
  </MemoryRouter>
);
const addButton = () => screen.getByRole("button", { name: /Thêm vào lịch trình/ });
const dayInput = () => screen.getByRole("spinbutton", { name: /Ngày thứ/ });

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(window, "alert").mockImplementation(() => {});
  jest.spyOn(window, "confirm").mockReturnValue(true);
  getPackageById.mockResolvedValue({ packageId: 7, title: "Test tour", duration: "3 days" });
  getPackageItineraries.mockResolvedValue([]);
  addItinerary.mockResolvedValue(item(1));
  deleteItinerary.mockResolvedValue(true);
});
afterEach(() => jest.restoreAllMocks());

const loadPage = async () => {
  renderPage();
  await screen.findByText("Test tour");
};

test("limits the day input and suggests a missing day instead of max day plus one", async () => {
  getPackageItineraries.mockResolvedValue([item(1), item(3)]);
  await loadPage();
  expect(dayInput()).toHaveAttribute("max", "3");
  expect(dayInput()).toHaveValue(2);
});

test.each(["4", "0", "-1", "1.5"])("rejects invalid day %s even if native validation is bypassed", async (day) => {
  await loadPage();
  fireEvent.change(dayInput(), { target: { value: day } });
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Activities" } });
  fireEvent.submit(addButton().closest("form"));
  expect(addItinerary).not.toHaveBeenCalled();
  expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("từ 1 đến 3"));
});

test("prevents duplicate days", async () => {
  getPackageItineraries.mockResolvedValue([item(1)]);
  await loadPage();
  fireEvent.change(dayInput(), { target: { value: "1" } });
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Activities" } });
  fireEvent.submit(addButton().closest("form"));
  expect(addItinerary).not.toHaveBeenCalled();
  expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("đã có lịch trình"));
});

test("disables adding when every day is filled and reopens a deleted day", async () => {
  getPackageItineraries.mockResolvedValueOnce([item(1), item(2), item(3)])
    .mockResolvedValue([item(1), item(3)]);
  await loadPage();
  expect(screen.getByRole("status")).toHaveTextContent("Đã có đủ lịch trình cho 3 ngày");
  expect(addButton()).toBeDisabled();
  expect(dayInput()).not.toHaveValue(4);
  fireEvent.click(screen.getAllByRole("button", { name: /Xóa/ })[1]);
  await waitFor(() => expect(addButton()).toBeEnabled());
  expect(dayInput()).toHaveValue(2);
});

test("allows the final valid day and then disables adding", async () => {
  getPackageItineraries.mockResolvedValueOnce([item(1), item(2)])
    .mockResolvedValue([item(1), item(2), item(3)]);
  await loadPage();
  expect(dayInput()).toHaveValue(3);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: " Last day activities " } });
  fireEvent.submit(addButton().closest("form"));
  await waitFor(() => expect(addItinerary).toHaveBeenCalledWith("7", {
    dayNumber: 3, description: "Last day activities"
  }));
  await screen.findByText(/Đã có đủ lịch trình cho 3 ngày/);
  expect(addButton()).toBeDisabled();
});

test("shows a server validation error instead of a success message", async () => {
  addItinerary.mockRejectedValue(new Error("Tour có 3 ngày. Ngày lịch trình phải từ 1 đến 3."));
  await loadPage();
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Activities" } });
  fireEvent.submit(addButton().closest("form"));
  await waitFor(() => expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Lỗi khi thêm lịch trình")));
  expect(window.alert).not.toHaveBeenCalledWith("Đã thêm lịch trình thành công!");
});

test.each(["tour", "itineraries"])("disables adding when %s cannot load", async (resource) => {
  (resource === "tour" ? getPackageById : getPackageItineraries).mockRejectedValue(new Error("Không thể tải dữ liệu."));
  renderPage();
  expect(await screen.findByRole("alert")).toHaveTextContent("Không thể tải dữ liệu.");
  expect(addButton()).toBeDisabled();
});

test("requires a valid day-based duration", async () => {
  getPackageById.mockResolvedValue({ title: "Test tour", duration: "3 hours" });
  await loadPage();
  expect(screen.getByRole("alert")).toHaveTextContent("Không xác định được số ngày");
  expect(addButton()).toBeDisabled();
});
