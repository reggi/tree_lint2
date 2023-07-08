import { findMostCommonString } from "../find_most_common_string/mod.ts"

export const findMostCommonFirstString = (input: string[][]): string => {
  return findMostCommonString(input.flatMap(v => v[0]))
}