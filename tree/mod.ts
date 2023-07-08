import { arrayDuplicates } from "../array_duplicates/mod.ts";
import { ChooseParent, ChooseParentOptions } from "../choose_parent/mod.ts";
import { deepKeys } from "../deep_keys/mod.ts";
import { deepParents } from "../deep_parents/mod.ts";
import { Edges } from "../graph/edge/mod.ts";
import { pruneCircular } from "../prune_circular/mod.ts";

export type TreeOptions = ChooseParentOptions

export class Tree {
  edges: Edges
  // deno-lint-ignore no-explicit-any
  structure: any = {$: {}}
  constructor(edges: Edges['TYPE']) {
    this.edges = new Edges(edges)
    this.create()
  }
  static build (edges: Edges['TYPE'], options?: TreeOptions) {
    const tree = new Tree(edges)
    pruneCircular(tree.structure, ['$'])
    const keys = deepKeys(tree.root)
    const duplicates = arrayDuplicates(keys)
    const parentNodes = deepParents(tree.root, duplicates)
    duplicates.forEach(duplicate => tree.removeChildhood(duplicate))
    const parentHandler = ChooseParent.returnsHandler(options)
    const reparentNodes = parentNodes.filter(v => v[1].length > 1)
    const newEdges = reparentNodes.map(v => parentHandler(v[0], v[1]))
    newEdges.forEach(edge => tree.assign(edge[0], edge[1]))
    return tree.root
  }
  get root () {
    return this.structure.$
  }
  assign (parent: string, child: string) {
    if (this.structure[child] === undefined) this.structure[child] = {}
    if (this.structure[parent] === undefined) this.structure[parent] = {}
    this.structure[parent][child] = this.structure[child]
  }
  removeRelation (parent: string, child: string) {
    delete this.structure[parent][child]
  }
  create () {
    this.edges.forEachValue(([parent, child]) => {
      this.assign(parent, child)
    })
  }
  removeParenthood (parent: string) {
    const parents = this.edges.filter(edge => edge.parentEquals(parent))
    parents.forEachValue(([parent, child]) => {
      this.removeRelation(parent, child)
    })
  }
  removeChildhood (child: string) {
    const children = this.edges.filter(edge => edge.childEquals(child))
    children.forEachValue(([parent, child]) => {
      this.removeRelation(parent, child)
    })
    this.removeRelation('$', child)
  }
}
