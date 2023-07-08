import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { Edge, Edges } from "./mod.ts";

Deno.test("Edge class", () => {
  const edge = new Edge(['parent', 'child']);

  assertEquals(edge.parent.value, "parent");
  assertEquals(edge.child.value, "child");

  assertEquals(edge.parentEquals("parent"), true);
  assertEquals(edge.childEquals("child"), true);
  assertEquals(edge.equalsEither("parent"), true);
  assertEquals(edge.equalsEither("child"), true);
  assertEquals(edge.equalsEither("other"), false);

  assertEquals(edge.match({ node: "parent" }), true);
  assertEquals(edge.match({ node: "child" }), true);
  assertEquals(edge.match({ node: "other" }), false);

  const flippedEdge = edge.flip;
  assertEquals(flippedEdge.parent.value, "child");
  assertEquals(flippedEdge.child.value, "parent");

  const fromEdge = edge.from("newParent");
  assertEquals(fromEdge.parent.value, "newParent");
  assertEquals(fromEdge.child.value, "parent");

  const toEdge = edge.to("newChild");
  assertEquals(toEdge.parent.value, "child");
  assertEquals(toEdge.child.value, "newChild");
});

Deno.test("Edges class", () => {
  const edges = new Edges([
    ["parent1", "child1"],
    ["parent2", "child2"],
    ["parent3", "child3"],
  ]);

  const nodes = edges.nodes;
  assertEquals(nodes.value, [
    "parent1",
    "child1",
    "parent2",
    "child2",
    "parent3",
    "child3",
  ]);

  const nodeList = edges.createNodeList("parent1", "child1", "parent2", "child2");
  assertEquals(nodeList.map(v => v.value), [
    "parent1",
    "child1",
    "parent2",
    "child2",
  ]);

  const filteredEdges = edges.withParent(["parent1", "parent2"]);
  assertEquals(filteredEdges.value, [
    ["parent1", "child1"],
    ["parent2", "child2"],
  ]);

  const edgeNodes = edges.edgeNodes;
  assertEquals(edgeNodes.value, [
    { node: "parent1", edges: edges.value },
    { node: "child1", edges: edges.value },
    { node: "parent2", edges: edges.value },
    { node: "child2", edges: edges.value },
    { node: "parent3", edges: edges.value },
    { node: "child3", edges: edges.value },
  ]);

  const edgeNode = edges.getEdgeNode("parent1");
  assertEquals(edgeNode.value, { node: "parent1", edges: edges.value });
});
