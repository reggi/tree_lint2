import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { arrayUnique, filterUnique } from "./mod.ts";

Deno.test("arrayUnique function", () => {
  const inputArray = [1, 2, 2, 3, 4, 4, 5, 5, 5];
  const uniqueArray = arrayUnique(inputArray);
  const expectedArray = [1, 2, 3, 4, 5];
  assertEquals(uniqueArray, expectedArray);
});

Deno.test("filterUnique function", () => {
  const array = [1, 2, 2, 3, 4, 4, 5, 5, 5];
  const uniqueArray = array.filter(filterUnique);
  const expectedArray = [1, 2, 3, 4, 5];
  assertEquals(uniqueArray, expectedArray);
});

Deno.test("filterUnique function with strings", () => {
  const array = ["apple", "banana", "apple", "banana", "cherry"];
  const uniqueArray = array.filter(filterUnique);
  const expectedArray = ["apple", "banana", "cherry"];
  assertEquals(uniqueArray, expectedArray);
});