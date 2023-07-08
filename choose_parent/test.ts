import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { ChooseParent } from "./mod.ts";

Deno.test("ChooseParent shortestParents parent", () => {
  const result = new ChooseParent('node', [
    ["parent1", "node"],
    ["parent2", "node"],
    ["parent3", "extra", "node"]
  ]);
  assertEquals(result.shortestParents().parent(), "$");
});

Deno.test("ChooseParent shortestParents parent flipped", () => {
  const result = new ChooseParent('node', [
    ["parent2", "node"],
    ["parent1", "node"],
    ["parent3", "extra", "node"]
  ]);
  assertEquals(result.shortestParents().parent(), "$");
});

Deno.test("ChooseParent shortestParents parents length", () => {
  const result = new ChooseParent('node', [
    ["parent1", "node"],
    ["parent2", "node"],
    ["parent3", "extra", "node"]
  ]);
  assertEquals(result.shortestParents().parents.length, 2);
});

Deno.test("ChooseParent longestParents parent", () => {
  const result = new ChooseParent('node', [
    ["parent1", "node"],
    ["parent2", "node"],
    ["parent3", "extra", "node"]
  ]);
  assertEquals(result.longestParents().parent(), "extra");
});

Deno.test("ChooseParent longestParents parents length", () => {
  const result = new ChooseParent('node', [
    ["parent1", "node"],
    ["parent2", "node"],
    ["parent3", "extra", "node"],
    ["parent3", "extra2", "node"],
  ]);
  assertEquals(result.longestParents().parents.length, 2);
});

Deno.test("ChooseParent longestParents parents x2", () => {
  const result = new ChooseParent('node', [
    ["parent1", "node"],
    ["parent2", "node"],
    ["parent3", "extra", "node"],
    ["parent3", "extra2", "node"],
  ]);
  assertEquals(result.longestParents().parent(), 'parent3');
});