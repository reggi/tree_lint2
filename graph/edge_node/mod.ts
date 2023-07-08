import { FactoryIterable } from "../../factory_iterable/mod.ts";
import { Edges } from "../edge/mod.ts";
import { Node, Nodes } from "../node/mod.ts";

type EdgeNodePlain = {
  node: string,
  edges: [string, string][]
}

type EdgeNodeComplex = {
  node: Node,
  edges: Edges
}

const singleConverter = (input: EdgeNodePlain | EdgeNodeComplex): EdgeNodePlain => {
  if (typeof input.node === "string" && Array.isArray(input.edges)) {
    return input as EdgeNodePlain;
  } else if (input.node instanceof Node && input.edges instanceof Edges) {
    return {
      node: input.node.value,
      edges: input.edges.value
    }
  }
  throw new Error("Invalid input");
}

// deno-lint-ignore no-explicit-any
const typeGuard = (input: any): input is EdgeNodePlain => {
  return typeof input.node === 'string' && Array.isArray(input.edges)
}

const [
  ProtoEdgeNode,
  ProtoEdgeNodes
] =
FactoryIterable<
  EdgeNodePlain,
  EdgeNodeComplex
>({
  singleConverter,
  typeGuard
})

export class EdgeNode extends ProtoEdgeNode {
  get node () {
    return new Node(this.value.node)
  }
  get edges () {
    return new Edges(this.value.edges)
  }
  get nodes () {
    return new Nodes(this.edges.map(v => v.nodes)).unique()
  }
  get edgeNodes () {
    return new EdgeNodes(this.nodes.map(n => new EdgeNode({ node: n, edges: this.edges})))
  }
  get usesEdges () {
    return this.edges.filter(e => e.parent.value === this.node.value)
  }
  get usedByEdges () {
    return this.edges.filter(e => e.child.value === this.node.value)
  }
  get usesNodes () {
    return new Nodes(this.usesEdges.map(e => e.child))
  }
  get usedByNodes () {
    return new Nodes(this.usedByEdges.map(e => e.parent))
  }
  get uses () {
    return new EdgeNodes(this.usesNodes.map(n => new EdgeNode({ node: n, edges: this.edges})))
  }
  get usedBy () {
    return new EdgeNodes(this.usedByNodes.map(n => new EdgeNode({ node: n, edges: this.edges})))
  }
  // /** circularity is the study of self-referential edges */
  get circular () {
    return this.uses.filter(edgeNode => edgeNode.uses.has(this))
  }
  get usedByCircular () {
    return this.usedBy.filter(this.circular.has)
  }
  get usedByNonCircular () {
    return this.usedBy.filter(this.circular.lacks)
  }
  get usesCircular () {
    return this.uses.filter(this.circular.has)
  }
  get usesNonCircular () {
    return this.uses.filter(this.circular.lacks)
  }
  get usedByFromCircularSibling () {
    return this.circular.mapClone(v => v.usedByNonCircular)
  }
  get usesFromCircularSibling () {
    return this.circular.mapClone(v => v.usesNonCircular)
  }
  get usedByIncludingCircularSibling () {
    return this.usedByFromCircularSibling.concat(this.usedByNonCircular)
  }
  get usesIncludingCircularSibling () {
    return this.usesFromCircularSibling.concat(this.usesNonCircular)
  }
  /** colocation is the usage of the ids as paths to determine information about edges */
  get colocated () {
    return this.edgeNodes.filter(edgeNode => edgeNode.node.dirname === this.node.dirname)
  }
  get usesColocated () {
    return this.usesIncludingCircularSibling.filter(this.colocated.has)
  }
  get usedByColocated () {
    return this.usedByIncludingCircularSibling.filter(this.colocated.has)
  }
  get usesWithoutColocated () {
    return this.usesIncludingCircularSibling.filter(this.colocated.lacks)
  }
  get usedByWithoutColocated () {
    return this.usedByIncludingCircularSibling.filter(this.colocated.lacks)
  }
}

export class EdgeNodes extends ProtoEdgeNodes<typeof EdgeNode, typeof EdgeNodes> {
  arrayMethods = this.generate(EdgeNode, EdgeNodes)
  get nodes () {
    return new Nodes(this.map(v => v.node))
  }
}