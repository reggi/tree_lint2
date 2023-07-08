import { absolutePath } from "./abs_path/mod.ts"
import { Tree, TreeOptions } from "./tree/mod.ts"
import { depsToEdges } from "./deps_to_edges/mod.ts"
import { Graph, GraphOptions } from "./graph/mod.ts"
import { ParseFilesOptions, parseFilesSync } from "./parse_files/mod.ts"
import { treeToProject } from "./tree_to_project/mod.ts"
import { walkDir } from "./walk_dir/mod.ts"

type Options = GraphOptions & TreeOptions & ParseFilesOptions & {
  extensions?: string[]
}

const main = (filePath: string, options?: Options) => {
  filePath = absolutePath(filePath)
  const files = walkDir(filePath, options?.extensions || ['.ts', '.tsx', '.js', '.jsx', '.json'])
  const deps = parseFilesSync(files)
  const keyNodes = Object.keys(deps)
  const edges = depsToEdges(deps)
  const graph = Graph.build(edges, keyNodes, options)
  const results = Tree.build(graph.edges, options)
  const project = treeToProject(results, options)
  // console.dir(JSON.stringify(project, null, 2), { depth: null })
  console.dir(project, { depth: null })
}

main('./', {
  extensions: ['.ts', '.js'],
  flipRelationFiles: ['^test\.(ts|tsx)$'],
  useDynamicRoots: true,
  keepFiles: ['^mod\.(ts|tsx)$', '^test\.(ts|tsx)$', '^types\.(ts|tsx)$'],
  indexName: 'mod',
})