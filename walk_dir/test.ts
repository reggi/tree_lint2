
import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { walkDir } from "./mod.ts";
import path from 'node:path'

Deno.test({
  name: "walkDir function",
  fn: async () => {
    // Create a temporary directory
    const tempDir = await Deno.makeTempDir();

    // Create some files in the directory
    const file1 = path.join(tempDir, "file1.txt");
    const file2 = path.join(tempDir, "file2.js");
    const file3 = path.join(tempDir, "file3.txt");
    const file4 = path.join(tempDir, "file4.json");

    // Write to files
    await Deno.writeTextFile(file1, "file1");
    await Deno.writeTextFile(file2, "file2");
    await Deno.writeTextFile(file3, "file3");
    await Deno.writeTextFile(file4, "file4");

    // Run the function with the temporary directory
    const files = walkDir(tempDir, [".txt"]);

    // Check the result
    assertEquals(files, [file3, file1]);

    // Clean up: remove the temporary directory
    await Deno.remove(tempDir, { recursive: true });
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
