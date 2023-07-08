import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { findMostCommonString } from "./mod.ts"; // Update with the correct path to your module

Deno.test("findMostCommonString should return the most common string occurrence in an array", () => {
  // Arrange
  const input = ["apple", "banana", "apple", "cherry", "banana", "banana"];

  // Act
  const result = findMostCommonString(input);

  // Assert
  assertEquals(result, "banana");
});
