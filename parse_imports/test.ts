import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts"
import {parseImports } from "./mod.ts"

Deno.test('parseImportsFromString', () => {
  const content = [
    [`import { parseImports } from '../parse_imports/mod.ts';`]
  ].flat(2).join('\n')
  const data = parseImports(content)
  assertEquals(data, ['../parse_imports/mod.ts'])
})

Deno.test('parseImportsFromString', () => {
  const content = [
    [`import { parseImports } from '../parse_imports/mod.ts';`]
  ].flat(2).join('\n')
  const data = parseImports(content, true, '/meow/woof/moo/oink')
  assertEquals(data, ['/meow/woof/parse_imports/mod.ts'])
})

Deno.test('parseImportsFromString', () => {
  const content = [
    [`import { parseImports } from '../parse_imports/mod.ts'`],
    [`import type DarkMatter from '../dark_matter/mod.ts'`],
  ].flat(2).join('\n')
  const data = parseImports(content, false)
  assertEquals(data, ['../parse_imports/mod.ts'])
})

Deno.test("parseImports should parse imports correctly with or without type imports", () => {
  // Test case 1
  const fileContent1 = [
    [`import { someFunc } from './someModule';`],
    [`import type { SomeType } from './someType';`],
    [`import meow from './anotherModule';`]
  ].flat(2).join('\n')
  const result1 = parseImports(fileContent1);
  assertEquals(result1, ["./someType", "./someModule", "./anotherModule"]);
  const result1WithoutTypes = parseImports(fileContent1, false);
  assertEquals(result1WithoutTypes, ["./someModule", "./anotherModule"]);
})

Deno.test("parseImports should parse imports correctly with or without type imports", () => {
  // Test case 2
  const fileContent2 = [
    [`import { someFunc } from './someModule';`],
    [`import type { SomeType } from './someType';`],
    [`import './anotherModule';`],
  ].flat(2).join('\n')
  const result2 = parseImports(fileContent2);
  assertEquals(result2, ["./someType", "./someModule", "./anotherModule"]);
  const result2WithoutTypes = parseImports(fileContent2, false);
  assertEquals(result2WithoutTypes, ["./someModule", "./anotherModule"]);
});
