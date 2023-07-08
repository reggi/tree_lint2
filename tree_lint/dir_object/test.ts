import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { dirObject } from "./mod.ts";

Deno.test("dirObject should create a directory object from paths", () => {
  const paths = [
    "path/to/file1.txt",
    "path/to/file2.txt",
    "path/to/another/file.txt",
    "path/to/another/file2.txt",
    "path/to/yet/another/file.txt",
  ];

  const expectedDirObject = {
    'file1.txt': {},
    'file2.txt': {},
    another: {
      'file.txt': {},
      'file2.txt': {},
    },
    yet: {
      another: {
        'file.txt': {},
      },
    },
  };

  const result = dirObject(paths);
  assertEquals(result, expectedDirObject);
});
