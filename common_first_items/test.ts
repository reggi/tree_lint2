import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { commonFirstItems } from "./mod.ts";

Deno.test('commonFirstItems', () => {
  const meow1 = [
    ['a', 'b', 'c'],
    ['a', 'b'],
    ['a'],
  ]

  assertEquals(commonFirstItems(meow1), ['a']);

  const meow2 = [
    ['a', 'b', 'c'],
    ['a', 'b'],
    ['a', 'b'],
  ]

  assertEquals(commonFirstItems(meow2), ['a', 'b']);

  const meow3 = [
    ['a', 'b', 'c'],
    ['a', 'b'],
    ['a', 'b', 'a'],
  ]

  assertEquals(commonFirstItems(meow3), ['a', 'b']);

  const meow4 = [
    [ "servex" ],
    [ "serve", "mod.ts" ]
  ]

  assertEquals(commonFirstItems(meow4), []);

})
