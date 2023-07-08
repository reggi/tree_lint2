import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts"
import { deepSort } from "../../deep_sort/mod.ts"
import { treeLintFlags } from "../tree_lint_flags/mod.ts"
import { treeLint } from "../mod.ts"

const {_, ...options} = treeLintFlags(Deno.args)
const filePath = _[0]
if (!filePath || typeof filePath !== 'string') throw new Error('Missing file path')

const { actual, expected } = treeLint(filePath, options)

if (options.actual && options.json) {
  console.log(JSON.stringify(deepSort(actual), null, 2))
} else if (options.actual) {
  console.dir(deepSort(actual), { depth: null })
} else if (options.expected && options.json) {
  console.log(JSON.stringify(deepSort(expected), null, 2))
} else if (options.expected) {
  console.dir(deepSort(expected), { depth: null })
} else {
  const runAssertion = () => {
    assertEquals(actual, expected)
    if (!options.noMessage) {
      console.log('all good 👍 ✅')
    }
  }
  if (!options.noAssert) {
    if (options.hideAssert) {
      try {
        runAssertion()
      } catch (_e) {
        if (!options.noMessage) {
          throw new Error('does not match ❌')
        }
        Deno.exit(1)
      }
    } else {
      runAssertion()
    }
  }
}

