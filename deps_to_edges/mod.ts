export type DepMap = Record<string, string[]>

export const depsToEdges = (depMap: DepMap): [string, string][] => {
  return Object.entries(depMap).map(([source, targets]) => {
    return targets.map(target => [source, target] as [string, string])
  }).flat()
}