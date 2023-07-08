import { arrayDuplicates } from "../array_duplicates/mod.ts";
import { arrayUnique } from "../array_unique/mod.ts";
import { ChooseParent, ChooseParentOptions } from "../choose_parent/mod.ts";
import { deepKeys } from "../deep_keys/mod.ts";
import { deepParents } from "../deep_parents/mod.ts";
import { Edges } from "../graph/edge/mod.ts";
import { pruneCircular } from "../prune_circular/mod.ts";

export type TreeOptions = ChooseParentOptions & {
  addUnusedGraphNodes?: boolean
}

export class Tree {
  edges: Edges
  // deno-lint-ignore no-explicit-any
  structure: {[key: string]: any } = {$: {}}
  usedKeys: string[]
  allKeys: string[]
  missingKeys: string[]
  structureKeys: {[key: string]: string[]}
  constructor(edges: Edges['TYPE']) {
    this.edges = new Edges(edges)
    this.create()
    this.usedKeys = deepKeys(this.root)
    this.allKeys = this.edges.nodes.unique().value
    this.missingKeys = this.allKeys.filter(node => !this.usedKeys.includes(node))
    this.structureKeys = this.analyze(this.structure)
  }
  static build (edges: Edges['TYPE'], options?: TreeOptions) {
    const tree = new Tree(edges)
    pruneCircular(tree.structure, ['$'])
    tree.discoverRoots()
    const usedKeys = deepKeys(tree.root)
    const duplicates = arrayDuplicates(usedKeys)
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
  analyze (structure: Tree['structure']) {
    return Object.fromEntries(Object.entries(structure)
      .filter(([key]) => key !== '$')
      .map(([key, value]) => {
        const keys = arrayUnique(deepKeys(value))
        return [key, keys]
      }))
  }
  discoverRoots() {
    if (this.missingKeys.length === 0) {
      return [];
    }

    const results: string[] = []
    const missingKeys = [...this.missingKeys];

    const recursive = (missingKeys: string[]) => {
      if (missingKeys.length === 0) return
      const round1 = Object.entries(this.structureKeys)
      .filter(([key]) => missingKeys.includes(key))
      .map(([key, value]) => {
        const intersection = value.filter((v) => missingKeys.includes(v));
        return [key, intersection] as [string, string[]]
      })
      .sort((a, b) => a[1].length - b[1].length)
      .reverse()
      
      if (round1.length === 0) return
      results.push(round1[0][0])
      missingKeys = missingKeys.filter(key => ![round1[0][0], ...round1[0][1]].includes(key))
      if (missingKeys.length > 0) {
        recursive(missingKeys)
      }
    }
    
    recursive(missingKeys)

    results.map(key => {
      this.assign('$', key)
    })

  }
}
