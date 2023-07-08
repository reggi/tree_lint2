import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { findMostCommonFirstString } from "./mod.ts"; // Update with the correct path to your module

Deno.test("findMostCommonFirstString should find the most frequent starting item(s) among subarrays", () => {
  // Arrange
  const input = [
    ["apple", "banana", "cherry"],
    ["apple", "blueberry", "coconut"],
    ["apple", "banana", "coconut"],
    ["apple", "cherry", "coconut"],
  ];

  // Act
  const result = findMostCommonFirstString(input);

  // Assert
  assertEquals(result, "apple");
});
