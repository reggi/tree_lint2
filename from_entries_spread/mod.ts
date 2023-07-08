
type Entries = [string, string[]][]

export const fromEntriesSpread = (entries: Entries) => {
  const obj: Record<string, string[]> = {}
  for (const [key, value] of entries) {
    obj[key] = obj[key] ? [...obj[key], ...value] : value
  }
  return obj
}