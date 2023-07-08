import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { groupEdgesByDir } from "./mod.ts";

Deno.test("groupEdgesByDir function", () => {
  const edges: [string, string][] = [
    ["dir1/subdir1/file1.ts", "dir1/subdir1/file2.ts"],
    ["dir1/subdir2/file3.ts", "dir1/subdir2/file4.ts"],
    ["dir2/subdir1/file1.ts", "dir2/subdir1/file2.ts"],
  ];

  const grouped = groupEdgesByDir(edges);

  const expected: {[key: string]: [string, string][] } = {
    dir1: [
      [ "dir1/subdir1/file1.ts", "dir1/subdir1/file2.ts" ],
      [ "dir1/subdir2/file3.ts", "dir1/subdir2/file4.ts" ]
    ],
    dir2: [
      [ "dir2/subdir1/file1.ts", "dir2/subdir1/file2.ts" ]
    ]
  };

  assertEquals(grouped, expected);
});

Deno.test("groupEdgesByDir 2", () => {
  const edges: [string, string][] = [
    ["dir1/subdir1/file1.ts", "dir1/subdir1/file2.ts"],
    ["dir1/subdir2/file3.ts", "dir1/subdir2/file4.ts"],
    ["dir2/subdir1/file1.ts", "dir2/subdir1/file2.ts"]
  ];

  const grouped = groupEdgesByDir(edges, 2);

  const expected: {[key: string]: [string, string][] } = {
    "dir1/subdir1": [ [ "dir1/subdir1/file1.ts", "dir1/subdir1/file2.ts" ] ],
    "dir1/subdir2": [ [ "dir1/subdir2/file3.ts", "dir1/subdir2/file4.ts" ] ],
    "dir2/subdir1": [ [ "dir2/subdir1/file1.ts", "dir2/subdir1/file2.ts" ] ]
  }

  assertEquals(grouped, expected);
});


Deno.test("groupEdgesByDir ?", () => {
  const edges: [string, string][] = [
    ["dir1/subdir1/file1.ts", "dir1/subdir1/file2.ts"],
    ["dir1/subdir2/file3.ts", "dir1/subdir2/file4.ts"],
    ["dir2/subdir1/file1.ts", "dir3/subdir1/file2.ts"]
  ];

  const grouped = groupEdgesByDir(edges, 2);

  const expected: {[key: string]: [string, string][] } = {
    "dir1/subdir1": [ [ "dir1/subdir1/file1.ts", "dir1/subdir1/file2.ts" ] ],
    "dir1/subdir2": [ [ "dir1/subdir2/file3.ts", "dir1/subdir2/file4.ts" ] ]
  }

  assertEquals(grouped, expected);
});

