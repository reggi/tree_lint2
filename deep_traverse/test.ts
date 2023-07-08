import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { deepTraverse } from "./mod.ts";

Deno.test("deepTraverse noop", () => {
  const obj = {
    "$": {
      "A": {
        "B": {
          "C": {
            "D": {}
          }
        },
        "E": {}
      },
      "F": {}
    }
  }
  const expected = {
    "$": {
      "A": {
        "B": {
          "C": {
            "D": {}
          }
        },
        "E": {}
      },
      "F": {}
    }
  }
  const result = deepTraverse(obj, () => false)
  assertEquals(result, expected)
})

Deno.test("deepTraverse parents", () => {
  const obj = {
    "A": {
      "B": {
        "C": {
          "D": {}
        }
      },
      "E": {}
    },
    "F": {}
  }
  const parent: string[][] = []
  deepTraverse(obj, ({ parentKey, key }) => {
    parent.push([...parentKey, key])
    return false
  })
  assertEquals(parent, [
    [ "A", "B", "C", "D"],
    [ "A", "B", "C" ],
    [ "A", "B" ],
    [ "A", "E" ],
    [ "A" ],
    [ "F" ]
  ])
})