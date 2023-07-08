import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { findShortestArray, findLongestArray } from "./mod.ts";

Deno.test("Find shortest array", () => {
  const arr: string[][] = [["a", "b", "c"], ["d", "e"], ["f"]];
  const shortest = findShortestArray(arr);
  assertEquals(shortest, ["f"]);
});

Deno.test("Find longest array", () => {
  const arr: string[][] = [["a", "b", "c"], ["d", "e"], ["f"]];
  const longest = findLongestArray(arr);
  assertEquals(longest, ["a", "b", "c"]);
});

Deno.test("Find shortest array in empty array", () => {
  const arr: string[][] = [];
  const shortest = findShortestArray(arr);
  assertEquals(shortest, null);
});

Deno.test("Find longest array in empty array", () => {
  const arr: string[][] = [];
  const longest = findLongestArray(arr);
  assertEquals(longest, null);
});