import type { Edge, Node } from "../process_deps/mod.ts";

export type NodeCycle = { [key in Node]: Node[] };

export function depthFirstSearch(node: Node, edges: Edge[], visitedNodes: Set<Node>, stackNodes: Set<Node>, cycles: NodeCycle, path: Node[] = []): void {
  visitedNodes.add(node);
  stackNodes.add(node);
  path.push(node);

  const adjacentNodes = edges
    .filter(([fromNode, _]) => fromNode === node)
    .map(([_, toNode]) => toNode);

  for (const adjacentNode of adjacentNodes) {
    if (!visitedNodes.has(adjacentNode)) {
      depthFirstSearch(adjacentNode, edges, visitedNodes, stackNodes, cycles, [...path]);
    } else if (stackNodes.has(adjacentNode)) {
      const cycle = path.slice(path.indexOf(adjacentNode));
      cycle.forEach(n => {
        cycles[n] = [...new Set([...(cycles[n] || []), ...cycle])];
      });
    }
  }

  stackNodes.delete(node);
}

export function propagateCycles(cycles: NodeCycle) {
  let updated = true;
  while (updated) {
    updated = false;
    for (const node in cycles) {
      const currentCycle = cycles[node];
      let newCycle = [...currentCycle];
      for (const c of currentCycle) {
        if (cycles[c]) {
          newCycle = [...newCycle, ...cycles[c]];
        }
      }
      if (new Set(newCycle).size !== new Set(currentCycle).size) {
        updated = true;
        cycles[node] = [...new Set(newCycle)];
      }
    }
  }
}