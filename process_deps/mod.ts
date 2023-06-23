import { NodeCycle, depthFirstSearch, propagateCycles } from "../depth_first_search/mod.ts"
import { deepTraverse2 } from "./deep_traverse/mod.ts"
import { findSharedPrefix } from "./shared_prefix/mod.ts"

export type Node = string
export type Edge = [Node, Node]
export type EdgePair = [Edge, Edge]

class NodeInstance {
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

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function getUniqueNodes(edges: Edge[]) {
  return unique(edges.flat(2))
}

export type Data = { [key: string]: string[] }
export const getEdges = (data: Data): Edge[] => {
  return Object.entries(data).flatMap(([k, v]) => v.map((e) => [k, e] as Edge))
}

export function getNodesCache (nodes: string[], edges: Edge[]) {
  const nodesCache: {[key: string]: NodeInstance} = {}
  nodes.forEach(node => {
    nodesCache[node] = new NodeInstance(node, edges, nodesCache)
  })
  return nodesCache
}

type EmptyObject = Record<string, never>
type Tree = { [key: string]: Tree | EmptyObject }

function getTree (nodes: string[]): Tree {
  return {
    ...Object.fromEntries(nodes.map(e => [e, {} as EmptyObject])),
    $: {}
  };
}

function buildTree (tree: Tree, edges: Edge[]): Tree {
  const i = {...tree}
  edges.forEach(e => i[e[0]][e[1]] = i[e[1]])
  return i
}

const toRootNode = (v: string | NodeInstance): Edge => ['$', toNode(v)]
const toNode = (v: string | NodeInstance) => typeof v === 'string' ? v : v.node
function isNotFalse<T>(v: T | false): v is T { return v !== false }

/** 
 * traverses the tree gathering the deep key for nodes to reparent
 * returns the [new parent, node] pairs
 */
const findReparentEdges = (tree: Tree, nodesToReparent: NodeInstance[]) => {
  return nodesToReparent.map(node => {
    const parents: string[] = []
    deepTraverse2(tree.$ || tree, (v) => {
      if (node.node === v.key) {
        parents.push(`${v.parentKey}`)
        return false
      }
      return false
    })
    if (parents.length === 1) return false
    const c = findSharedPrefix(parents)
    const sharedNode = c.split('.')
    const parent = sharedNode.pop()
    if (!parent) throw new Error('issue popping')
    const result: Edge = [parent, node.node]
    return result
  }).filter(isNotFalse)
}

const deleteNodesFromParents = (tree: Tree, nodes: NodeInstance[]) => {
  const i = {...tree}
  nodes.forEach(node => {
    node.strictParents.map((parent: string) => {
      delete i[parent][node.node]
    })
  })  
  return i
}

export const runEdges = (edges: Edge[]) => {
  const uniqueNodes = getUniqueNodes(edges)
  const nodesCache = getNodesCache(uniqueNodes, edges)
  const nodes = Object.values(nodesCache)
  const tree = getTree(uniqueNodes)
  const rootNodes = nodes.filter(node => node.isRoot).map(toNode)
  const circularNodes = nodes.filter(node => node.isCircular).map(toNode)
  const circularBinaryExtraEdges = nodes.map(node => node.circularBinaryExtraEdges).flat()
  const reparentNodes = nodes.filter(node => node.needsReparenting)
  const rootEdges = rootNodes.map(toRootNode)
  const removeEdgesThatPointToRoot = (e: Edge) => !rootNodes.includes(e[1])
  const removeEdgesWhereParentAndChildAreCircular = (e: Edge) => !(circularNodes.includes(e[0]) && circularNodes.includes(e[1]))

  const treeEdges: Edge[] = [
    ...edges
      .filter(removeEdgesThatPointToRoot)
      .filter(removeEdgesWhereParentAndChildAreCircular),
    ...circularBinaryExtraEdges,
    ...rootEdges
  ]
  const firstTree = buildTree(tree, treeEdges)
  const newEdges = findReparentEdges(firstTree, reparentNodes)
  const secondTree = deleteNodesFromParents(firstTree, reparentNodes)
  const thirdTree = buildTree(secondTree, newEdges)
  return thirdTree.$
}

export const runDeps = (data: Data) => {
  return runEdges(getEdges(data))
}
