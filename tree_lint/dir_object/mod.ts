import path from 'node:path'
import { slicePathsAtSharedIndexMap } from "../../slice_paths/mod.ts";

type DirObject = { [key: string]: DirObject };
export function dirObject (paths: string[]): DirObject {
  paths = slicePathsAtSharedIndexMap(paths)
  const input = paths.map((filePath) => filePath.split(path.sep))
  const root: DirObject = {};
  for (const path of input) {
    let node = root;
    for (const part of path) {
      if (!(part in node)) {
        node[part] = {};
      }
      node = node[part];
    }
  }
  return root;
}