import { formatDateRange, getAvatarStyles, getTripCoverStyle } from "@/utils/ui";
import { describe, expect, it } from "vitest";

describe("getTripCoverStyle", () => {
  it("returns only the cover height variable when no image is provided", () => {
    expect(getTripCoverStyle()).toEqual({ "--cover-h": "350" });
  });

  it("includes a background image gradient and sizing when an image URL is provided", () => {
    const style = getTripCoverStyle("https://example.com/photo.jpg");
    expect(style["--cover-h"]).toBe("350");
    expect(style.backgroundImage).toContain("url(https://example.com/photo.jpg)");
    expect(style.backgroundImage).toContain("linear-gradient");
    expect(style.backgroundSize).toBe("cover");
    expect(style.backgroundPosition).toBe("center");
  });
});

describe("formatDateRange", () => {
  it("collapses same-month ranges to 'MMM d–d, yyyy'", () => {
    expect(formatDateRange("01 Jun 2024", "15 Jun 2024")).toBe("Jun 1–15, 2024");
  });

  it("shows both months when they differ but year is the same", () => {
    expect(formatDateRange("28 Mar 2024", "10 Apr 2024")).toBe("Mar 28 – Apr 10, 2024");
  });

  it("shows full dates including years when years differ", () => {
    expect(formatDateRange("28 Dec 2023", "05 Jan 2024")).toBe("Dec 28, 2023 – Jan 5, 2024");
  });

  it("handles a single-day trip within the same month", () => {
    expect(formatDateRange("10 Jun 2024", "10 Jun 2024")).toBe("Jun 10–10, 2024");
  });
});

describe("getAvatarStyles", () => {
  it("returns a valid style object for every letter a–z", () => {
    const letters = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ];

    for (const letter of letters) {
      const style = getAvatarStyles({ id: 1, firstName: letter.toUpperCase(), lastName: "Test" });
      expect(style.bg, `missing bg for letter "${letter}"`).toBeTruthy();
      expect(style.icon, `missing icon for letter "${letter}"`).toBeTruthy();
    }
  });

  it("returns the default grey style for an unrecognised first character", () => {
    const style = getAvatarStyles({ id: 1, firstName: "1Unknown", lastName: "User" });
    expect(style.bg).toContain("bg-gray-700");
    expect(style.icon).toContain("text-gray-700");
  });
});
