import path from 'node:path';

export const siblingFiles = (main: string, paths: string[]): string[] => {
  const mainDir = path.dirname(main);
  return paths.filter(pathItem => path.dirname(pathItem) === mainDir);
};
