import { groupArraysByLongestLength, groupArraysByShortestLength } from "../group_arrays/mod.ts"
import { commonFirstItems } from "../common_first_items/mod.ts"
import { groupBy } from "../group_by/mod.ts"
import { findShortestArray } from "../2d-array/mod.ts"
import { isNotNull } from "../guards/mod.ts"

export type ChooseParentOptions = {
  deduplicateStyle?: 'shortest' | 'longest'
}

export class ChooseParent {
  parents: string[][]
  constructor(public node: string, parents: string[][]) {
    this.parents = parents.map(v => v.filter(v => v !== node))
  }
  shortestParents () {
    this.parents = groupArraysByShortestLength(this.parents)
    return this
  }
  longestParents () {
    this.parents = groupArraysByLongestLength(this.parents)
    return this
  }
  sharedParent () {
    this.parents = [commonFirstItems(this.parents)]
    return this
  }
  dedoupReparentNodes () {
    const grouping = groupBy(this.parents, parent => parent[parent.length - 1])
    this.parents = Object.entries(grouping).map(([_key, value]) => {
      return findShortestArray(value)
    }).filter(isNotNull)
    return this
  }
  parent (root = "$") {
    if (this.parents.length > 1) this.sharedParent()
    const firstSortedParent = this.parents[0]
    const parent = firstSortedParent[firstSortedParent.length - 1]
    return parent || root
  }
  asEdge (root = "$") {
    const result: [string, string] = [this.parent(root), this.node]
    return result
  }
  fromOption (props: 'shortest' | 'longest' = 'shortest') {
    // this.dedoupReparentNodes()
    if (props === 'shortest') return this.shortestParents()
    if (props === 'longest') return this.longestParents()
    return this
  }
  static handler (node: string, parents: string[][], options?: {deduplicateStyle?: 'shortest' | 'longest'}) {
    return new ChooseParent(node, parents)
      .fromOption(options?.deduplicateStyle)
      .asEdge()
  }
  static returnsHandler (options?: ChooseParentOptions) {
    return (node: string, parents: string[][]) => {
      return ChooseParent.handler(node, parents, options)
    }
  }
}