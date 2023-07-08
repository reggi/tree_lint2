import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts"
import { fromEntriesSpread } from "./mod.ts"

Deno.test('fromEntriesSpread', () => {
  assertEquals(fromEntriesSpread([
    [ "a", [] ],
    [ "b", [ "d" ] ],
    [ "c", [ "b" ] ],
    [ "c", [ "a" ] ],
  ]), {
    a: [],
    b: [ "d" ],
    c: [ "b", "a" ],
  })
})