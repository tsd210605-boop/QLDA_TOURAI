import { getAllDestinations, addItinerary, getPackageItineraries, deleteItinerary } from "./adminApi";
import { ENDPOINTS } from "./config";

const originalFetch = global.fetch;
beforeEach(() => { global.fetch = jest.fn(); localStorage.clear(); });
afterAll(() => { global.fetch = originalFetch; });

test("loads the actual catalog through the configured admin API", async () => {
  const records = [{ id: 12, name: "Biển Vô Cực" }];
  global.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => records });
  await expect(getAllDestinations()).resolves.toEqual(records);
  expect(global.fetch).toHaveBeenCalledWith(ENDPOINTS.adminDestinations, expect.any(Object));
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

test("reports access errors without silently trying unrelated fallback endpoints", async () => {
  global.fetch.mockResolvedValue({ ok: false, status: 403 });
  await expect(getAllDestinations()).rejects.toThrow(/không có quyền quản trị/i);
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

test("reports malformed catalog responses instead of pretending the database is empty", async () => {
  global.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({ error: "invalid" }) });
  await expect(getAllDestinations()).rejects.toThrow("Dữ liệu điểm đến trả về không hợp lệ.");
});

test.each([
  ["add", () => addItinerary(7, { dayNumber: 4, description: "Activities" })],
  ["load", () => getPackageItineraries(7)],
  ["delete", () => deleteItinerary(11)]
])("propagates itinerary %s failures instead of treating JSON errors as success", async (_, callApi) => {
  global.fetch.mockResolvedValue({ ok: false, status: 400,
    json: async () => ({ error: "Tour có 3 ngày. Ngày lịch trình phải từ 1 đến 3." }) });
  await expect(callApi()).rejects.toThrow("Tour có 3 ngày");
});
