import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { filterWithout, arrayWithout } from "./mod.ts";

Deno.test("filterWithout function", () => {
  const array = [1, 2, 2, 3, 4, 4, 5, 5, 5];
  const filteredArray = array.filter(filterWithout(2, 4));
  const expectedArray = [1, 3, 5, 5, 5];
  assertEquals(filteredArray, expectedArray);
});

Deno.test("arrayWithout function", () => {
  const array = [1, 2, 2, 3, 4, 4, 5, 5, 5];
  const filteredArray = arrayWithout(array, 2, 4);
  const expectedArray = [1, 3, 5, 5, 5];
  assertEquals(filteredArray, expectedArray);
});