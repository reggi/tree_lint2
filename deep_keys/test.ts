import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { deepKeys } from "./mod.ts";

Deno.test("deepKeys function", () => {
  const testObj = {
    a: 1,
    b: 2,
    c: {
      d: 3,
      e: 4,
      f: {
        g: 5
      }
    }
  };

  const keys = deepKeys(testObj);
  const expectedKeys = ["a", "b", "c", "d", "e", "f", "g"];
  assertEquals(keys, expectedKeys);
});


Deno.test("deepKeys with parent", () => {
  const testObj = {
    a: 1,
    b: 2,
    c: {
      d: 3,
      e: 4,
      f: {
        g: 5
      }
    }
  };

  const keys = deepKeys(testObj, '.');
  const expectedKeys = ["a", "b", "c", "c.d", "c.e", "c.f", "c.f.g"];
  assertEquals(keys, expectedKeys);
});
