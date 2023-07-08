import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { siblingFiles } from "./mod.ts";

Deno.test("getSiblingFiles function", () => {
  const mainFilePath = "/home/user/main.txt";
  const filePaths = [
    "/home/user/file1.txt",
    "/home/user/file2.txt",
    "/home/user/subdir/file3.txt",
    "/home/another_user/file4.txt"
  ];

  const _siblingFiles = siblingFiles(mainFilePath, filePaths);

  const expected = [
    "/home/user/file1.txt",
    "/home/user/file2.txt"
  ];

  assertEquals(_siblingFiles, expected);
});