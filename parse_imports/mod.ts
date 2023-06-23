import path from 'node:path'

export const parseImportsSync = (filePath: string, passFilePath = true) => {
  const fileContent = Deno.readTextFileSync(filePath)
  return parseImportsFromString(fileContent, passFilePath ? filePath : undefined)
}

export const parseImportsWithoutTypeSync = (filePath: string, passFilePath = true) => {
  const fileContent = Deno.readTextFileSync(filePath)
  return parseImportTypesFromString(fileContent, passFilePath ? filePath : undefined).regularImports
}

export const parseImportsFromString = (fileContent: string, filePath?: string) => {
  const { typeImports, regularImports } = parseImportTypesFromString(fileContent, filePath)
  return [...typeImports, ...regularImports]
}

export const parseImportTypesFromString = (fileContent: string, filePath?: string) => {
  const lines = fileContent.split('\n');
  const regularImports: string[] = [];
  const typeImports: string[] = [];
  lines.forEach((line) => {
    const trimmedLine = line.trimStart();
    if (trimmedLine.startsWith('import')) {
      const match = line.match(/from ['"]((?:\.\.\/|\.\/).*?)['"]/);
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