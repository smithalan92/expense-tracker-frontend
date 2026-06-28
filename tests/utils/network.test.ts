import { describe, expect, it } from "vitest";
import { makeNetworkError } from "../fixtures/network";
import { isNetworkError } from "@/utils/network";

describe("isNetworkError", () => {
  it("returns true for a network error", () => {
    expect(isNetworkError(makeNetworkError())).toBe(true);
  });

  it("returns false for a plain Error", () => {
    expect(isNetworkError(new Error("Something went wrong"))).toBe(false);
  });

  it("returns false for an axios error that is not a network error", () => {
    const err = makeNetworkError();
    err.code = "ERR_BAD_RESPONSE";
    expect(isNetworkError(err)).toBe(false);
  });
});
