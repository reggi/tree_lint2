import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { EdgeNode } from "./mod.ts";

Deno.test("EdgeNode", () => {

  const edgeNode = new EdgeNode({
    node: "A",
    edges: [["A", "B"], ["A", "C"]]
  });

  assertEquals(edgeNode.node.value, "A");
  assertEquals(edgeNode.edges.value, [["A", "B"], ["A", "C"]]);

  const nodes = edgeNode.nodes;
  assertEquals(nodes.value, ["A", "B", "C"]);

  const edgeNodes = edgeNode.edgeNodes;
  assertEquals(edgeNodes.value.length, 3);
  assertEquals(edgeNodes.value[0].node, "A");
  assertEquals(edgeNodes.value[1].node, "B");
  assertEquals(edgeNodes.value[2].node, "C");

  const usesEdges = edgeNode.usesEdges;
  assertEquals(usesEdges.value.length, 2);
  assertEquals(usesEdges.value, [['A', 'B'], ['A', 'C']]);
  
  const usedByEdges = edgeNode.usedByEdges;
  assertEquals(usedByEdges.value.length, 0);

  const usesNodes = edgeNode.usesNodes;
  assertEquals(usesNodes.value.length, 2);
  assertEquals(usesNodes.value[0], "B");
  assertEquals(usesNodes.value[1], "C");

  const usedByNodes = edgeNode.usedByNodes;
  assertEquals(usedByNodes.value.length, 0);

  const uses = edgeNode.uses;
  assertEquals(uses.length, 2);
  assertEquals(uses.value.map(v => v.node), ["B", "C"]);

  const usedBy = edgeNode.usedBy;
  assertEquals(usedBy.value.length, 0);

  const circular = edgeNode.circular;
  assertEquals(circular.value.length, 0);

  const usedByCircular = edgeNode.usedByCircular;
  assertEquals(usedByCircular.value.length, 0);

  const usedByNonCircular = edgeNode.usedByNonCircular;
  assertEquals(usedByNonCircular.value.length, 0);

  const usesCircular = edgeNode.usesCircular;
  assertEquals(usesCircular.value.length, 0);

  const usesNonCircular = edgeNode.usesNonCircular;
  assertEquals(usesNonCircular.value.length, 2);

  const usedByFromCircularSibling = edgeNode.usedByFromCircularSibling;
  assertEquals(usedByFromCircularSibling.value.length, 0);

  const usesFromCircularSibling = edgeNode.usesFromCircularSibling;
  assertEquals(usesFromCircularSibling.value.length, 0);

  const usedByIncludingCircularSibling = edgeNode.usedByIncludingCircularSibling;
  assertEquals(usedByIncludingCircularSibling.value.length, 0);

  const usesIncludingCircularSibling = edgeNode.usesIncludingCircularSibling;
  assertEquals(usesIncludingCircularSibling.value.length, 2);

  const colocated = edgeNode.colocated;
  assertEquals(colocated.value.length, 3);

  const usesColocated = edgeNode.usesColocated;
  assertEquals(usesColocated.value.length, 0);

  const usedByColocated = edgeNode.usedByColocated;
  assertEquals(usedByColocated.value.length, 0);

  const usesWithoutColocated = edgeNode.usesWithoutColocated;
  assertEquals(usesWithoutColocated.value.length, 2);

  const usedByWithoutColocated = edgeNode.usedByWithoutColocated;
  assertEquals(usedByWithoutColocated.value.length, 0);
});
