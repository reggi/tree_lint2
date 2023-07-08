import { ensureDirSync } from 'https://deno.land/std@0.192.0/fs/ensure_dir.ts';
import path from 'node:path'
import { deepKeys } from '../deep_keys/mod.ts';

interface FileStructure {
  [key: string]: string | FileStructure;
}

function buildDirectoryStructure(
  directory: string,
  fileStructure: FileStructure
) {
  for (const key in fileStructure) {
    const newFilePath = path.join(directory, key);
    const value = fileStructure[key]
    if (typeof value === "string") {
      Deno.writeTextFileSync(newFilePath, value);
    } else {
      ensureDirSync(newFilePath);
      buildDirectoryStructure(newFilePath, value);
    }
  }
}

export class TestDirectory {
  tempDir: string;
  keys: string[];
  constructor(fileStructure: FileStructure) {
    const tmpDir = Deno.makeTempDirSync();
    buildDirectoryStructure(tmpDir, fileStructure);
    this.tempDir = tmpDir;
    this.keys = deepKeys(fileStructure, path.sep)
  }
  get absKeys () {
    return this.keys.map((key) => path.join(this.tempDir, key))
  }
  getKey (key: string) {
    const k = this.keys.find((k) => k.endsWith(key))
    if (!k) throw new Error('Key not found')
    if (path.isAbsolute(k)) return k
    return path.join(this.tempDir, k)
  }
  public cleanup(): void {
    Deno.removeSync(this.tempDir, { recursive: true });
  }
}
