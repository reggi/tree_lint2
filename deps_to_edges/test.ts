import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { depsToEdges, DepMap } from "./mod.ts";

Deno.test("depsToEdges should convert dependency map to edges", () => {
  const depMap: DepMap = {
    A: ["B", "C"],
    B: ["D"],
    C: ["E", "F"],
    D: ["G"],
    E: [],
    F: [],
    G: [],
  };

  const expectedEdges: [string, string][] = [
    ["A", "B"],
    ["A", "C"],
    ["B", "D"],
    ["C", "E"],
    ["C", "F"],
    ["D", "G"],
  ];

  const edges = depsToEdges(depMap);
  assertEquals(edges, expectedEdges);
});

Deno.test("depsToEdges should handle empty dependency map", () => {
  const depMap: DepMap = {};

  const expectedEdges: [string, string][] = [];

  const edges = depsToEdges(depMap);
  assertEquals(edges, expectedEdges);
});
