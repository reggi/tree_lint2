import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { groupArraysByShortestLength, groupArraysByLongestLength } from "./mod.ts";

Deno.test("groupArraysByShortestLength function", () => {
  const array = [
    ["apple", "banana"],
    ["cherry", "date", "elderberry"],
    ["fig", "grape"]
  ];
  const grouped = groupArraysByShortestLength(array);
  const expected = [
    ["apple", "banana"],
    ["fig", "grape"]
  ];
  assertEquals(grouped, expected);
});

Deno.test("groupArraysByLongestLength function", () => {
  const array = [
    ["apple", "banana"],
    ["cherry", "date", "elderberry"],
    ["fig", "grape"]
  ];
  const grouped = groupArraysByLongestLength(array);
  const expected = [
    ["cherry", "date", "elderberry"]
  ];
  assertEquals(grouped, expected);
});