import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { groupPaths } from "./mod.ts"; // Update with the correct path to your module

Deno.test("groupPaths should group paths correctly", () => {
  // Arrange
  const paths = [
    "path/to/file1.txt",
    "path/to/file2.txt",
    "path/to/another/file.txt",
    "other/path/file.txt",
    "other/path/another/file.txt",
  ];

  // Act
  const result = groupPaths(paths);

  // Assert
  assertEquals(result, {
    "path": [
      "path/to/file1.txt",
      "path/to/file2.txt",
      "path/to/another/file.txt",
    ],
    "other": [
      "other/path/file.txt",
      "other/path/another/file.txt",
    ],
  });
});

Deno.test("groupPaths should group paths correctly with a shared beginning path", () => {
  // Arrange
  const paths = [
    "shared/path/file1.txt",
    "shared/path/file2.txt",
    "shared/path/another/file.txt",
    "shared/other/path/file.txt",
    "shared/other/path/another/file.txt",
  ];

  // Act
  const result = groupPaths(paths);

  // Assert
  assertEquals(result, {
    "shared/path": [
      "shared/path/file1.txt",
      "shared/path/file2.txt",
      "shared/path/another/file.txt",
    ], 
    "shared/other": [
      "shared/other/path/file.txt",
      "shared/other/path/another/file.txt",
    ]
  });
});