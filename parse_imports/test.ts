import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts"
import { parseImportsFromString } from "./mod.ts"

Deno.test('parseImportsFromString', () => {
  const content = `import { parseImports } from '../parse_imports/mod.ts';`
  const data = parseImportsFromString(content)
  assertEquals(data, ['../parse_imports/mod.ts'])
})