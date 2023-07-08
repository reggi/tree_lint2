import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { arraysEqual } from "./mod.ts";

Deno.test('arraysEqual should compare arrays correctly', () => {
  // Test case 1: Arrays with the same elements
  const arr1 = [1, 2, 3];
  const arr2 = [1, 2, 3];
  assertEquals(arraysEqual(arr1, arr2), true);

  // Test case 2: Arrays with different lengths
  const arr3 = [1, 2, 3];
  const arr4 = [1, 2];
  assertEquals(arraysEqual(arr3, arr4), false);

  // Test case 3: Arrays with different elements
  const arr5 = [1, 2, 3];
  const arr6 = [1, 4, 3];
  assertEquals(arraysEqual(arr5, arr6), false);
});
