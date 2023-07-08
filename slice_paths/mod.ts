import path from 'node:path'
import { commonFirstItems } from '../common_first_items/mod.ts'

/** given an array of paths will provide only the common parts of the path */
export function getSharedPath (filePaths: string[]) {
  const sharedPathIndex = commonFirstItems(filePaths.map(v => v.split(path.sep)))
  return sharedPathIndex.join(path.sep)
}

export function getSharedPathIndex (filePaths: string[]) {
  return commonFirstItems(filePaths.map(v => v.split(path.sep))).length
}

function transformPath (filePath: string, transform: (v: string[]) => string[]) {
  return transform(filePath.split(path.sep)).join(path.sep)
}

export function transformPaths (filePaths: string[], transform: (v: string[]) => string[]) {
  return filePaths
    .map(v => transformPath(v, transform))
}

export function slicePaths (filePaths: string[], index: number) {
  return transformPaths(filePaths, v => v.slice(index))
}

export function slicePath (filePaths: string, index: number) {
  return transformPath(filePaths, v => v.slice(index))
}

export const slicePathsAtSharedIndex = (filePaths: string[]) => {
  const sharedIndex = getSharedPathIndex(filePaths)
  return (filePath: string) => slicePath(filePath, sharedIndex)
}

export const slicePathsAtSharedIndexMap = (filePaths: string[]) => {
  const sharedIndex = getSharedPathIndex(filePaths)
  return filePaths.map(v => slicePath(v, sharedIndex))
}