import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { objectMap } from "./mod.ts"; // Update with the correct path to your module

Deno.test("objectMap should map object values correctly", () => {
  // Arrange
  const input = {
    key1: 1,
    key2: 2,
    key3: 3,
  };

  // Act
  const result = objectMap(input, ([key, value]) => [key, value * 2]);

  // Assert
  assertEquals(result, {
    key1: 2,
    key2: 4,
    key3: 6,
  });
});
