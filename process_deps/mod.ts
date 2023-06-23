
import { deepTraverse } from "./deep_traverse/mod.ts"
import { NodeInstance } from "../node_instance/mod.ts"
import { findSharedPrefix } from "./shared_prefix/mod.ts"

export type Node = string
export type Edge = [Node, Node]
export type EdgePair = [Edge, Edge]

export function unique<T>(arr: T[]): T[] {
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
    deepTraverse(tree.$ || tree, (v) => {
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
