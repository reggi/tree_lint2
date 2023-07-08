import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import {
  getSharedPath,
  getSharedPathIndex,
  slicePaths,
  slicePath,
  slicePathsAtSharedIndex,
  slicePathsAtSharedIndexMap,
} from "./mod.ts";

Deno.test("getSharedPath", () => {
  const filePaths = [
    "/root/src/components/Button.ts",
    "/root/src/components/Input.ts",
    "/root/src/utils/Helper.ts",
  ];

  const expected = "/root/src";
  const result = getSharedPath(filePaths);
  assertEquals(result, expected);
});

Deno.test("getSharedPathIndex", () => {
  const filePaths = [
    "/root/src/components/Button.ts",
    "/root/src/components/Input.ts",
    "/root/src/utils/Helper.ts",
  ];

  const result = getSharedPathIndex(filePaths);
  assertEquals(result, 3);
});

Deno.test("slicePaths", () => {
  const filePaths = [
    "/root/src/components/Button.ts",
    "/root/src/components/Input.ts",
    "/root/src/utils/Helper.ts",
  ];

  const expected = [
    "components/Button.ts",
    "components/Input.ts",
    "utils/Helper.ts",
  ];
  const result = slicePaths(filePaths, 3);
  assertEquals(result, expected);
});

Deno.test("slicePath", () => {
  const filePath = "/root/src/components/Button.ts";

  const expected = "components/Button.ts";
  const result = slicePath(filePath, 3);
  assertEquals(result, expected);
});

Deno.test("slicePathsAtSharedIndex", () => {
  const filePaths = [
    "/root/src/components/Button.ts",
    "/root/src/components/Input.ts",
    "/root/src/utils/Helper.ts",
  ];

  const expected = [
    "components/Button.ts",
    "components/Input.ts",
    "utils/Helper.ts",
  ];
  const sliceAtSharedIndex = slicePathsAtSharedIndex(filePaths);
  const result = filePaths.map(sliceAtSharedIndex);
  assertEquals(result, expected);
});

Deno.test("slicePathsAtSharedIndexMap", () => {
  const filePaths = [
    "/root/src/components/Button.ts",
    "/root/src/components/Input.ts",
    "/root/src/utils/Helper.ts",
  ];

  const expected = [
    "components/Button.ts",
    "components/Input.ts",
    "utils/Helper.ts",
  ];
  const result = slicePathsAtSharedIndexMap(filePaths);
  assertEquals(result, expected);
});
