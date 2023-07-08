import path from 'node:path'
import { groupBy } from '../group_by/mod.ts'

export const groupEdgesByDir = (edges: [string, string][], number = 1) => {
  return groupBy(edges, ([parent, child]: [string, string]) => {
    const a = parent.split(path.sep).slice(0, number).join(path.sep)
    const b = child.split(path.sep).slice(0, number).join(path.sep)
    return a === b ? a : null
  })
}