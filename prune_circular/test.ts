// deno-lint-ignore-file no-explicit-any

import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { pruneCircular } from "./mod.ts";

Deno.test("pruneCircular function", () => {
  const circularObject: any = { name: "root" };
  circularObject.self = circularObject;

  const prunedObject = pruneCircular(circularObject);
  const expected = { name: "root" };

  assertEquals(prunedObject, expected);
});