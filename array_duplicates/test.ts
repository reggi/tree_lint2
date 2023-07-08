
import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { arrayDuplicates } from "./mod.ts";

Deno.test("arrayDuplicates should return an array of duplicate elements", () => {
  const arr = ["a", "b", "c", "a", "d", "b", "e"];
  const expectedDuplicates = ["a", "b"];
  const duplicates = arrayDuplicates(arr);
  assertEquals(duplicates, expectedDuplicates);
});

Deno.test("arrayDuplicates should return an empty array if no duplicates are found", () => {
  const arr = ["a", "b", "c", "d", "e"];
  const expectedDuplicates: string[] = [];
  const duplicates = arrayDuplicates(arr);
  assertEquals(duplicates, expectedDuplicates);
});

Deno.test("arrayDuplicates should handle an empty array", () => {
  const arr: string[] = [];
  const expectedDuplicates: string[] = [];
  const duplicates = arrayDuplicates(arr);
  assertEquals(duplicates, expectedDuplicates);
});
