import path from 'node:path'

export const absolutePath = (filePath: string) => {
  return (path.isAbsolute(filePath)) ? filePath : path.join(Deno.cwd(), filePath)
}
