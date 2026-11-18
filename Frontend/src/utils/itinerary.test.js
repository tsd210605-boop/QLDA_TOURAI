import { getDurationDays, firstAvailableDay } from "./itinerary";

test.each(["3 days", "3 ngày", "3", "3N2Đ", "3 ngày 2 đêm", " 3 DAYS / 2 NIGHTS "])("reads duration %s", (duration) => {
  expect(getDurationDays(duration)).toBe(3);
});

test.each([null, "", "unknown", "3 hours", "2.5 days", "0 days", "999999999999 days"])("rejects invalid duration %s", (duration) => {
  expect(getDurationDays(duration)).toBeNull();
});

test("ignores invalid legacy days when finding the next available day", () => {
  expect(firstAvailableDay([{ dayNumber: 1 }, { dayNumber: 4 }], 3)).toBe(2);
});
