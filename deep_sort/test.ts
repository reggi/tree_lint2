import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { deepSort } from "./mod.ts";

Deno.test("deepSort function", () => {
  const testObj = {
    b: 2,
    a: 1,
    c: {
      d: 3,
      f: {
        g: 5,
        h: 6
      },
      e: 4,
    }
  };

  const sortedObj = deepSort(testObj);

  const expectedObj = {
    a: 1,
    b: 2,
    c: {
      d: 3,
      e: 4,
      f: {
        g: 5,
        h: 6
      }
    }
  };

  assertEquals(sortedObj, expectedObj);
});
