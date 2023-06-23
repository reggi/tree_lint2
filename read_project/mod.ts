import { walkSync } from 'https://deno.land/std@0.192.0/fs/mod.ts';
import { parseImportsSync } from '../parse_imports/mod.ts';
import path from 'node:path'

const filesProjectName = (filePath: string) => {
  return path.basename(path.dirname(filePath))
}

function without<T>(...values: T[]): (element: T) => boolean {
  return (element: T) => !values.includes(element);
}

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

type ParseImports = (filePath: string) => string[]

function walkDirectoryForTypeScriptFiles(directory: string) {
  const tree: string[] = [];
  for (const entry of walkSync(directory)) {
    if (entry.isFile && entry.name.endsWith('.ts')) {
      tree.push(entry.path);
    }
  }
  return tree;
}

function createTreeFromFiles(files: string[], parseImports: ParseImports = parseImportsSync) {
  const tree: Record<string, string[]> = {};
  function processFile(filePath: string) {
    const deps = parseImports(filePath)
    const project = filesProjectName(filePath)
    // console.log({ filePath, project, deps })
    tree[project] = unique([
      ...(tree[project] || []),
      ...deps.map(filesProjectName).filter(without(project))
    ]).filter(v => !['.', '..'].includes(v))
  }
  files.forEach(processFile)
  return tree
}

type TreeNode = { [key: string]: TreeNode };

function createObject(input: string[][]): TreeNode {
  const root: TreeNode = {};
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

/** given a list of paths returns all  */
const findDuplicateDirs = (dirs: string[][]) => {
  const dirMap: Record<string, number[]> = {}
  dirs.forEach((paths) => {
    paths.forEach((path, ix) => {
      if (!dirMap[path]) dirMap[path] = []
      dirMap[path].push(ix)
    })
  })
  const list = Object.fromEntries(Object
    .entries(dirMap)
    .map(([k, levels]) => ([k, unique(levels)] as [string, number[]])))
  const duplicateDirs: string[] = Object.entries(list).filter(v => v[1].length > 1).map(v => v[0])
  return duplicateDirs
}

type Sortable = { [key: string]: Sortable } | Sortable[] | null | string | number | boolean;

export function sortObjectKeys(obj: Sortable): Sortable {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  const sortedKeys = Object.keys(obj).sort();
  return sortedKeys.reduce((sortedObj: { [key: string]: Sortable }, key: string) => {
    sortedObj[key] = sortObjectKeys(obj[key]);
    return sortedObj;
  }, {});
}

export function directoryObject(directory: string) {
  const filePaths = walkDirectoryForTypeScriptFiles(directory)
  const paths = unique(filePaths
    .map(filePath => path.dirname(filePath))
  ).map(v => v.split(path.sep))
  const shortest = paths.map(v => v.length).sort()[0]
  const dirs = paths.map(v => v.slice(shortest-1))
  const dupes = findDuplicateDirs(dirs)
  const object = createObject(dirs)
  if (dupes.length) throw new Error('Duplicate directories found: ' + dupes.join(', '))
  return object
}

export function readProject(directory: string, parseImports: ParseImports = parseImportsSync): Record<string, string[]> {
  const files = walkDirectoryForTypeScriptFiles(directory)
  return createTreeFromFiles(files, parseImports)
}