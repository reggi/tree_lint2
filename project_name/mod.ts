import path from 'node:path'

export interface ProjectNameOptions {
  keepFiles?: string[];
  indexName?: string | string[];
}

export const projectName = (
  filePath: string,
  options: ProjectNameOptions = {}
): { file: string, dir: string } => {
  const { keepFiles = [], indexName = [] } = options;
  const indexes = [indexName].flat()
  const index: string | undefined = indexes[0]

  const extname = path.extname(filePath)
  const dirname = path.basename(path.dirname(filePath))
  const basename = path.basename(filePath)
  const name = path.basename(filePath, extname)
  
  const isSplitName = name.includes('.')
  const isIndex = indexes.includes(name)
  const keepFilesPattern = new RegExp(keepFiles.join('|'))
  const isKeepFile = keepFiles.length ? Boolean(basename.match(keepFilesPattern)) : false

  if (isKeepFile) {
    return {
      file: basename,
      dir: dirname
    }
  }

  if (isSplitName) {
    const results = name.split('.')
    return {
      file: `${results[1]}${extname}`,
      dir: results[0]
    }
  }

  if (isIndex) {
    return {
      file: `${index}${extname}`,
      dir: dirname
    }
  }

  if (index) {
    return {
      file: `${index}${extname}`,
      dir: name
    }  
  }

  return {
    file: basename,
    dir: name
  }
}