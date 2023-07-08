import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { Edge, Edges } from "./edge/mod.ts";
import { Graph } from "./mod.ts";

Deno.test("Graph - addEdge", () => {
  const graph = new Graph([]);
  const edge = new Edge(["A", "B"]);
  const newGraph = graph.addEdge(edge);

  assertEquals(newGraph.edges.value, [edge.value]);
  assertEquals(newGraph.keyNodes.value, []);
});

Deno.test("Graph - setExclusions", () => {
  const graph = new Graph([["A", "B"], ["B", "C"]]);
  const newGraph = graph.setExclusions({ node: '^A$' })
  assertEquals(newGraph.edges.value, [["B", "C"]]);
  assertEquals(newGraph.keyNodes.value, ["B", "C"]);
});

Deno.test("Graph - setPromoted", () => {
  const graph = new Graph([["A", "B"], ["B", "C"]]);
  const newGraph = graph.setPromoted({ node: '^A$' })

  assertEquals(newGraph.edges.value, [["A", "B"], ["B", "C"], ["$", "A"]]);
  assertEquals(newGraph.keyNodes.value, ["A", "B", "C"]);
});

Deno.test("Graph - applyOptions", () => {
  const graph = new Graph([
    ["./src/fileA.ts", "./src/fileB.ts"],
    ["./src/fileB.ts", "./src/fileC.ts"],
    ["./src/fileC.ts", "./src/fileD.ts"],
  ])
  const newGraph = graph.applyOptions({ useDynamicRoots: true })
  assertEquals(newGraph.edges.value, [
    ["./src/fileA.ts", "./src/fileB.ts"],
    ["./src/fileB.ts", "./src/fileC.ts"],
    ["./src/fileC.ts", "./src/fileD.ts"],
    ["$", "./src/fileA.ts"],
  ]);
  assertEquals(newGraph.keyNodes.value, [
    "./src/fileA.ts",
    "./src/fileB.ts",
    "./src/fileC.ts",
    "./src/fileD.ts",
  ]);
});

// Deno.test("Graph - applyOptions", () => {
//   const edges = new Edges([
//     ["./src/fileA.ts", "./src/fileB.ts"],
//     ["./src/fileB.ts", "./src/fileC.ts"],
//     ["./src/fileC.ts", "./src/fileD.ts"],
//   ])
//   const keyNodes = edges.nodes
//   const edgesWithUnused = edges.concat(["./src/unused.ts", "./src/fileB.ts"])
//   assertEquals(edgesWithUnused.length, 4)
//   const graph = new Graph(edgesWithUnused, keyNodes)

//   assertEquals(graph.unrecognizedEdgeNodes.length, 1)
//   assertEquals(graph.unrecognizedEdgeNodes.value, ["./src/unused.ts"]) 

//   const newGraph = graph.applyOptions({ noOutsideReferences: true })

//   assertEquals(newGraph.edges.value, [
//     ["./src/fileA.ts", "./src/fileB.ts"],
//     ["./src/fileB.ts", "./src/fileC.ts"],
//     ["./src/fileC.ts", "./src/fileD.ts"]
//   ]);
//   assertEquals(newGraph.keyNodes.value, [
//     "./src/fileA.ts",
//     "./src/fileB.ts",
//     "./src/fileC.ts",
//     "./src/fileD.ts",
//   ]);
// });