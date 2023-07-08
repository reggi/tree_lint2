import { FactoryIterable } from "../../factory_iterable/mod.ts";
import { Matches } from "../../matches/types.ts";
import { EdgeNode, EdgeNodes } from "../edge_node/mod.ts";
import { Node, Nodes } from "../node/mod.ts";

const [ProtoEdge, ProtoEdges] = FactoryIterable<[string, string], [Node, Node]>({
  singleConverter: (tuple: [Node, Node] | [string, string]): [string, string] => {
    const [parent, child] = tuple;
    if (parent instanceof Node && child instanceof Node) {
      return [parent.value, child.value];
    }
    if (typeof parent === "string" && typeof child === "string") {
      return [parent, child];
    }
    throw new Error("Invalid tuple");
  },
  // deno-lint-ignore no-explicit-any
  typeGuard: (value: any): value is [string, string] => {
    return Array.isArray(value) && value.length === 2 && typeof value[0] === "string" && typeof value[1] === "string"
  },
})

export class Edge extends ProtoEdge {
  get nodes () {
    return new Nodes([this.parent, this.child])
  }
  get nodesArray () {
    return [this.parent, this.child]
  }
  get parent () {
    return new Node(this.value[0])
  }
  get child () {
    return new Node(this.value[1])
  }
  parentEquals (value: Node['TYPE']) {
    return this.parent.equals(value)
  }
  childEquals (value: Node['TYPE']) {
    return this.child.equals(value)
  }
  eitherEquals (value: Node['TYPE']) {
    return this.parentEquals(value) || this.childEquals(value)
  }
  equalsEither = this.eitherEquals.bind(this)
  matchParent (matches?: Matches) {
    if (!matches) return false
    return this.parent.match(matches)
  }
  matchChild (matches?: Matches) {
    if (!matches) return false
    return this.child.match(matches)
  }
  match (matches?: Matches) {
    if (!matches) return false
    return this.matchParent(matches) || this.matchChild(matches)
  }
  get flip () {
    return new Edge([this.child, this.parent])
  }
  from (value: Node['TYPE']) {
    return new Edge([new Node(value), this.parent])
  }
  to (value: Node['TYPE']) {
    return new Edge([this.child, new Node(value)])
  }
}

export class Edges extends ProtoEdges<typeof Edge, typeof Edges> {
  arrayMethods = this.generate(Edge, Edges)
  get nodes () {
    return new Nodes(this.flatMap(v => v.nodesArray))
  }
  createNodeList (...value: Nodes['TYPE'][]) {
    return value.map(v => new Nodes(v).value).flat().map(v => new Node(v));
  }
  filterSome (nodes: Node[], matchFn: (edge: Edge, node: Node) => boolean) {
    return this.filter(e => nodes.some((n) => matchFn(e, n)));
  }
  // with
  withParent (...value: Nodes['TYPE'][]) {
    const nodes = this.createNodeList(...value)
    return this.filterSome(nodes, (edge, node) => edge.parentEquals(node))
  }
  withChild (...value: Nodes['TYPE'][]) {
    const nodes = this.createNodeList(...value)
    return this.filterSome(nodes, (edge, node) => edge.childEquals(node))
  }
  withEither (...value: Nodes['TYPE'][]) {
    const nodes = this.createNodeList(...value)
    return this.filterSome(nodes, (edge, node) => edge.eitherEquals(node))
  }
  // without
  withoutParent (...value: Nodes['TYPE'][]) {
    const nodes = this.createNodeList(...value)
    return this.filterSome(nodes, (edge, node) => !edge.parentEquals(node))
  }
  withoutChild (...value: Nodes['TYPE'][]) {
    const nodes = this.createNodeList(...value)
    return this.filterSome(nodes, (edge, node) => !edge.childEquals(node))
  }
  withoutEither (...value: Nodes['TYPE'][]) {
    const nodes = this.createNodeList(...value)
    return this.filterSome(nodes, (edge, node) => !edge.eitherEquals(node))
  }
  get edgeNodes () {
    return new EdgeNodes(this.nodes.unique().map(node => ({ node, edges: this })))
  }
  getEdgeNode (node: Node['TYPE']) {
    const n = new Node(node)
    return new EdgeNode({ node: n, edges: this })
  }
}