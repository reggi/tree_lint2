import path from 'node:path'

export type ParseFunctionSignature = (fileContent: string, filePath?: string) => string[]

export const parseImportsFunction = (withTypes = true): ParseFunctionSignature => {
  return (fileContent: string, filePath?: string) => {
    return parseImports(fileContent, withTypes, filePath);
  }
}

export const parseImports = (fileContent: string, withTypes = true, filePath?: string) => {
  const { typeImports, regularImports } = parseImportTypes(fileContent, filePath);
  return withTypes ? [...typeImports, ...regularImports] : regularImports;
}

export const parseImportTypes = (fileContent: string, filePath?: string) => {
  const lines = fileContent.split('\n');
  const regularImports: string[] = [];
  const typeImports: string[] = [];
  lines.forEach((line) => {
    const trimmedLine = line.trimStart();
    if (trimmedLine.startsWith('import')) {
      let match = line.match(/from ['"]((?:\.\.\/|\.\/).*?)['"]/);
      if (!match) {
        match = line.match(/import\s+['"]((?:\.\.\/|\.\/).*?)['"]/);
      }
      if (match) {
        const importPath = match[1];
        const absolutePath = filePath ? path.resolve(path.dirname(filePath), importPath) : importPath;
        if (trimmedLine.match(/^import\s+type/)) {
          typeImports.push(absolutePath);
        } else {
          regularImports.push(absolutePath);
        }
      }
    }
  })
  return { regularImports, typeImports }
}
