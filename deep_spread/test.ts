import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { deepSpread } from "./mod.ts";

Deno.test("deepSpread function", () => {
  const target = { a: 1, b: { c: 3, d: 4 }, e: 5 };
  const source = { b: { c: 30 }, f: 6 };

  const result = deepSpread(target, source);

  assertEquals(result, { a: 1, b: { c: 30, d: 4 }, e: 5, f: 6 });
});
