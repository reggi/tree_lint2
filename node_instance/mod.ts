import { NodeCycle, depthFirstSearch, propagateCycles } from "../depth_first_search/mod.ts"
import { Edge, Node, getNodesCache, getUniqueNodes, unique } from "../process_deps/mod.ts"

export class NodeInstance {
  nodesCache: {[key: string]: NodeInstance} 
  constructor(
    public node: Node,
    public edges: Edge[],
    nodesCache?: {[key: string]: NodeInstance}
  ) {
    this.nodesCache = nodesCache || getNodesCache(getUniqueNodes(edges), edges)
  }
  get parentEdges ()  {
    return this.edges.filter(e => e[1] === this.node)
  }
  get childEdges ()  {
    return this.edges.filter(e => e[0] === this.node)
  }
  get parents () {
    return this.parentEdges.map(e => e[0])
  }
  get children () {
    return this.childEdges.map(e => e[1])
  }
  get hasSingleParent () {
    return this.parents.length === 1
  }
  get hasNoParent () {
    return this.parents.length === 0
  }

  get isCircular(): boolean {
    return this.circularNodes.length > 0;
  }

  get circularNodes(): Node[] {
    const cycles: NodeCycle = {};
    const visitedNodes = new Set<string>();
    const stackNodes = new Set<string>();
    depthFirstSearch(this.node, this.edges, visitedNodes, stackNodes, cycles);
    propagateCycles(cycles);
    return cycles[this.node] || [];
  }

  get circularEscapeNodes () {
    return this.parents.filter(node => !this.circularNodes.includes(node))
  }
  get noCircularEscapeNodes () {
    return !this.circularEscapeNodes.length
  }
  getInstances (nodes: Node[]) {
    return nodes.map(node => this.nodesCache[node])
  }
  get _siblingEscapeNodes () {
    return this.getInstances(this.circularNodes)
      .map(n => n.circularEscapeNodes).flat()
  }
  
  get siblingEscapeNodes () {
    return this._siblingEscapeNodes.filter(node => !this.circularNodes.includes(node))
  }

  get noCircularEscape () {
    const allSiblingsHaveNoEscape = this
      .getInstances(this.circularNodes)
      .every(n => n.noCircularEscapeNodes)
    return Boolean(
      allSiblingsHaveNoEscape && 
      this.noCircularEscapeNodes
    )
  }
  get isCircularRoot () {
    return Boolean(this.isCircular && this.noCircularEscape)
  }
  get isCircularNonRoot () {
    return Boolean(this.isCircular && !this.noCircularEscape)
  }
  get isNonCircularRoot () {
    return Boolean(!this.isCircular && this.hasNoParent)
  }
  get isRoot () {
    return this.isCircularRoot || this.isNonCircularRoot
  }
  
  /**
   * because a "parent" is defined as any node that uses a node all circular
   * nodes are parents of each other when nodes only are parents of each other
   * we call that a root circular because no other part of the project uses them
   * they will appear at the root circular nodes can be 2 or more nodes it's not
   * just binary however we consider ['a', 'b'] and ['b', 'a'] to be directly
   * circular when a node circular and is used by something else (thats not
   * circular) it's considered to have an "escape" hatch an escape from the
   * circularity at which point all nodes that are in the circularity are
   * considered siblings and will be nested within that parent (if theres only
   * one) if there's several it's treated as any other module and will be
   * hoisted up we need a key to describe the parent of any node circular or not
   * because 'parent" is insufficient
   */
  get strictParents () {
    // circular nodes with no escape have no parent
    if (this.isCircular && this.noCircularEscapeNodes) return []
    if (this.isCircular) return unique([...this.siblingEscapeNodes, ...this.circularEscapeNodes])
    return this.parents
  }
  get needsReparenting () {
    // what doesn't need reparenting?
    // anything that is root or has one parent
    return (
      !this.isRoot && 
      this.strictParents.length > 1
    )
  }
  get circularBinaryExtraEdges (): Edge[] {
    // for an nodes that are circular and have an escape
    // we need to make sure all nodes have that same escape edge
    return this.siblingEscapeNodes.map(node => [node, this.node])
  }
}