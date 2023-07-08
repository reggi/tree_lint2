import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { Tree } from "./mod.ts";

Deno.test("tree.build should correctly construct the tree structure", () => {
  const edges = [
    ["A", "B"],
    ["B", "C"],
    ["B", "D"],
    ["C", "E"],
    ["C", "F"],
    ["D", "G"],
    ["E", "H"],
    ["$", "A"],
  ] satisfies [string, string][];

  const expectedStructure = {
    A: {
      B: {
        C: {
          E: {
            H: {},
          },
          F: {},
        },
        D: {
          G: {},
        },
      },
    },
  };

  const result = Tree.build(edges);
  assertEquals(result, expectedStructure);
});

Deno.test("Tree.removeChildhood should remove child nodes and their relationships", () => {
  const edges = [
    ["A", "B"],
    ["B", "C"],
    ["B", "D"],
    ["C", "E"],
    ["C", "F"],
    ["D", "G"],
    ["E", "H"],
    ["$", "A"],
  ] satisfies [string, string][];

  const tree = new Tree(edges);
  tree.removeChildhood("C");

  const expectedStructure = {
    A: {
      B: {
        D: {
          G: {},
        },
      },
    },
  };

  assertEquals(tree.root, expectedStructure);
});

