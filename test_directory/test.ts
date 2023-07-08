import { assertEquals, assertExists, assertThrows } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { TestDirectory } from "./mod.ts";
import path from 'node:path'

Deno.test("TestDirectory should create a temporary directory with the specified structure", () => {
  const directoryStructure = {
    "file1.txt": "Hello, World!",
    "subdir": {
      "file2.txt": "This is a subdirectory",
      "subsubdir": {
        "file3.txt": "Nested file",
      },
    },
  };

  const testDirectory = new TestDirectory(directoryStructure);

  try {
    assertExists(testDirectory.tempDir);
    assertEquals(Deno.lstatSync(testDirectory.tempDir).isDirectory, true);

    const expectedFiles = [
      "file1.txt",
      "subdir/file2.txt",
      "subdir/subsubdir/file3.txt",
    ];

    for (const file of expectedFiles) {
      const filePath = path.join(testDirectory.tempDir, file)
      assertEquals(Deno.lstatSync(filePath).isFile, true);
    }
  } finally {
    testDirectory.cleanup();
    assertThrows(() => Deno.lstatSync(testDirectory.tempDir));
  }
});
