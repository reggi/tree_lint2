
import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { deepMapStringKeys } from "./mod.ts";

Deno.test("testing deepMapStringKeys", () => {
  const obj = {
    a: 1,
    b: { c: 2, d: { e: 3 } },
  }; 
  const result = deepMapStringKeys(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      return {[key + "_mapped"]: value};
    } else {
      return {[key + "_mapped"]: value * 2};
    }
  });
  assertEquals(result, {
    a_mapped: 2,
    b_mapped: { c_mapped: 4, d_mapped: { e_mapped: 6 } },
  });
});