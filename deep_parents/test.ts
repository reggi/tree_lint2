import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { deepParents } from "./mod.ts";

Deno.test("deepParents", () => {
  const obj = {
    "A": {
      "B": {
        "C": {
          "D": {}
        }
      },
      "E": {
        "D": {}
      }
    },
    "F": {}
  }
  const result = deepParents(obj, ['D', 'A']);
  assertEquals(result, [
    ["D", [ [ "A", "B", "C"], [ "A", "E"] ]],
    ["A", [ [] ]]
  ])
})
