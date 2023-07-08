import { arrayUnique } from "../array_unique/mod.ts";
import { parseImports } from "../parse_imports/mod.ts";

export const parseFileSync = (filePath: string, withTypes?: boolean) => {
  const fileContent = Deno.readTextFileSync(filePath);
  return parseImports(fileContent, withTypes, filePath)
}

export type ParseFilesOptions = {
  withTypes?: boolean,
  recursive?: boolean
}

export function parseFilesSync (
  files: string[],
  options: ParseFilesOptions = {},
  visited: string[] = [],
) {
  const { withTypes = true, recursive = false } = options;

  const tree: Record<string, string[]> = {};

  function processFile(filePath: string) {
    if (visited.includes(filePath)) {
      return;
    }
    visited.push(filePath);
    const deps = parseFileSync(filePath, withTypes);

    tree[filePath] = arrayUnique([
      ...(tree[filePath] || []),
      ...deps.filter(v => v !== filePath),
    ]);

    if (recursive) {
      deps.forEach(processFile);
    }
  }

  files.forEach(processFile);

  return tree;
}
