import { formatPrice, formatDuration, categoryLabel, roleLabel, statusLabel } from "./locale";

test.each([
  [4680000, "4.680.000 đ"], [0, "0 đ"], ["1500000", "1.500.000 đ"],
  [null, "Chưa có giá"], [NaN, "Chưa có giá"]
])("formats stored VND without applying an exchange rate: %s", (value, expected) => {
  expect(formatPrice(value)).toBe(expected);
});

test("translates display values without changing stored category, role or status codes", () => {
  const code = "Nature & Adventure";
  expect(categoryLabel(code)).toBe("Thiên nhiên và khám phá");
  expect(code).toBe("Nature & Adventure");
  expect(formatDuration("3 days")).toBe("3 ngày");
  expect(roleLabel("ADMIN")).toBe("Quản trị viên");
  expect(statusLabel("BOOKED")).toBe("Đã đặt");
});
