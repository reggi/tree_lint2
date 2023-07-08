import {
  Matches,
  ExcludeMatches,
  PromoteMatches,
  extractExcludeMatches,
  extractPromoteMatches
} from "../matches/mod.ts"
import { ProjectNameOptions, projectName } from "../project_name/mod.ts"
import { Edge, Edges } from "./edge/mod.ts"
import { Node, Nodes } from "./node/mod.ts"

export type GraphOptions = ExcludeMatches & PromoteMatches & ProjectNameOptions & {
  useDynamicRoots?: boolean
  removeUnrecognizedEdges?: boolean
  flipRelationFiles?: string[]
}
 
export class Graph {
  keyNodes: Nodes
  edges: Edges
  constructor (
    edges: Edges["TYPE"],
    keyNodes?: Nodes['TYPE']
  ) {
    this.edges = new Edges(edges)
    this.keyNodes = keyNodes ? new Nodes(keyNodes).unique() : this.edges.nodes.unique()
  }
  /** this needs to be computed as getter because edges can change and the relationships change with them */
  get nodes () { return this.edges.nodes }
  get edgeNodes () { return this.edges.edgeNodes }
  addEdge (edge: Edge['TYPE']) {
    const e = new Edge(edge)
    const edges = [...this.edges.value, e.value]
    return new Graph(edges, this.keyNodes)
  }
  setExclusions (options: Matches) {
    this.keyNodes = this.keyNodes.filter(node => !node.match(options))
    this.edges = this.edges.filter(edge => !edge.match(options))
    return this
  }
  setPromoted (options: Matches, root = new Node('$')) {
    const rootNodes = this.nodes.filter(node => node.match(options))
    return this.setRoot(rootNodes, root)
  }
  setRoot (rootNodes: Nodes, root = new Node('$')) {
    const rootEdges = rootNodes.map(node => new Edge([root, node]))
    this.edges = this.edges.concat(rootEdges)
    return this
  }
  addDynamicRoots (root = new Node('$')) {
    return this.setRoot(this.rootNodes, root)
  }
  applyOptions (options?: GraphOptions, root = new Node('$')) {
    if (options?.removeUnrecognizedEdges) {
      this.removeNodes(this.unrecognizedEdgeNodes)
    }
    if (options?.flipRelationFiles) {
      this.flipRelationFiles(options.flipRelationFiles, options)
    }
    const e = extractExcludeMatches(options)
    const p = extractPromoteMatches(options)
    this.setExclusions(e)
    if (options?.useDynamicRoots) {
      this.addDynamicRoots(root)
    }
    this.setPromoted(p, root)
    return this
  }
  removeNodes (nodes: Nodes['TYPE']) {
    this.edges = this.edges.withoutEither(nodes)
  }
  flipRelationFiles (files: string[], options?: GraphOptions) {
    this.edges = this.edges.mapClone(edge => {
      const parentDir = projectName(edge.parent.value, options).dir
      const childDir = projectName(edge.child.value, options).dir
      if (edge.matchParent({ basenames: files }) && parentDir === childDir) {
        return edge.flip;
      } else {
        return edge;
      }
    });
    return this
  }
  get unusedKeyNodes () {
    return this.keyNodes.filter(this.edges.nodes.lacks)
  }
  get unrecognizedEdgeNodes () {
    return this.edges.nodes.filter(this.keyNodes.lacks)
  }
  get circularNodes () {
    return this.edgeNodes.filter(node => node.circular.hasItems)
  }
  get circularNodesWithoutEscape () {
    return this.edgeNodes.filter(node => {
      return (
        node.circular.hasItems &&
        node.usedByIncludingCircularSibling.isEmpty
      )
    })
  }
  get unused () {
    return this.edgeNodes.filter(node => !node.circular.hasItems && node.usedBy.isEmpty)
  }
  get rootNodes () {
    return this.circularNodesWithoutEscape.concat(this.unused).nodes
  }
  edgesWithParent (node: Node['TYPE']) {
    return this.edges.filter(edge => edge.parentEquals(node))
  }
  edgesWithChild (node: Node['TYPE']) {
    return this.edges.filter(edge => edge.childEquals(node))
  }
  static build (
    edges: Edges["TYPE"],
    keyNodes?: Nodes['TYPE'],
    options?: GraphOptions,
  ) {
    const g = new Graph(edges, keyNodes)
    return g.applyOptions(options)
  }
}
