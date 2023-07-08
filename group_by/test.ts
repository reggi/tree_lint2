import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { groupBy } from "./mod.ts"; // Update with the correct path to your module

Deno.test("groupBy should group items correctly", () => {
  // Arrange
  const input = [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" },
    { id: 3, name: "John" },
    { id: 4, name: "Mary" },
    { id: 5, name: "Jane" },
  ];

  // Act
  const result = groupBy(input, (item) => item.name);

  // Assert
  assertEquals(result, {
    John: [
      { id: 1, name: "John" },
      { id: 3, name: "John" },
    ],
    Jane: [
      { id: 2, name: "Jane" },
      { id: 5, name: "Jane" },
    ],
    Mary: [
      { id: 4, name: "Mary" },
    ],
  });
});
