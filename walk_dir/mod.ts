import { walkSync } from 'https://deno.land/std@0.192.0/fs/mod.ts';
import path from 'node:path'

export function walkDir(directory: string, includeExtensions: string[]) {
  const tree: string[] = [];
  for (const entry of walkSync(directory)) {
    if (entry.isFile) {
      if (includeExtensions.includes(path.extname(entry.name))) {
        tree.push(entry.path)
      }
    }
  }
  return tree;
}
