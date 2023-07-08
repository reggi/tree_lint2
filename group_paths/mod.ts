import path from 'node:path'
import { commonFirstItems } from '../common_first_items/mod.ts'
import { groupBy } from '../group_by/mod.ts'

export function groupPaths(paths: string[]) {
  const x = commonFirstItems(paths.map(v => v.split(path.sep)))
  return groupBy(paths, (filePath) => {
    return filePath.split(path.sep).slice(0, x.length + 1).join(path.sep)
  })
}
