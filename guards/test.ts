import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { isNotNull, isNotUndefined } from "./mod.ts";

Deno.test("isNotNull should return true when value is not null", () => {
  const value = "Hello";
  const result = isNotNull(value);
  assertEquals(result, true);
});

Deno.test("isNotNull should return false when value is null", () => {
  const value = null;
  const result = isNotNull(value);
  assertEquals(result, false);
});

Deno.test("isNotUndefined should return true when value is not undefined", () => {
  const value = 123;
  const result = isNotUndefined(value);
  assertEquals(result, true);
});

Deno.test("isNotUndefined should return false when value is undefined", () => {
  const value = undefined;
  const result = isNotUndefined(value);
  assertEquals(result, false);
});
