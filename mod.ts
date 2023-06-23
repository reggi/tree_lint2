import { parse } from "https://deno.land/std@0.192.0/flags/mod.ts";
import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { runDeps } from "./process_deps/mod.ts";
import { parseImportsSync, parseImportsWithoutTypeSync } from "./parse_imports/mod.ts";
import { directoryObject, readProject, sortObjectKeys } from "./read_project/mod.ts";
import path from 'node:path'

const NO_TYPE_IMPORT = 'no-type-import'
const NO_ABS_PATH = 'no-abs-path'
const PROJECT = 'project'
const ACTUAL = 'actual'
const EXPECTED = 'expected'
const NO_ASSERT = 'no-assert'
const HIDE_ASSERT = 'hide-assert'
const NO_MSG = 'no-msg'
const flags = parse(Deno.args, { 
  string: ['_'],
  boolean: [
    NO_TYPE_IMPORT,
    NO_ABS_PATH,
    PROJECT,
    ACTUAL,
    EXPECTED,
    NO_ASSERT,
    NO_MSG,
    HIDE_ASSERT
  ]
})

const denoCwd = Deno.cwd()
const _cwd = flags._[0] || denoCwd
const cwd = (_cwd && path.isAbsolute(_cwd)) ? _cwd : path.join(denoCwd, _cwd)

const withTypes = !flags[NO_TYPE_IMPORT]
const parseAbsolutePaths = !flags[NO_ABS_PATH]
const parseWithTypes = (v: string) => parseImportsSync(v, parseAbsolutePaths)
const parseWithoutTypes = (v: string) => parseImportsWithoutTypeSync(v, parseAbsolutePaths)
const parseImports = withTypes ? parseWithTypes : parseWithoutTypes
const actual = directoryObject(cwd)
const project = readProject(cwd, parseImports)
const expected = runDeps(project)

if (flags[ACTUAL]) {
  console.log(JSON.stringify(sortObjectKeys(actual), null, 2))
}
if (flags[PROJECT]) {
  console.log(JSON.stringify(sortObjectKeys(project), null, 2))
}
if (flags[EXPECTED]) {
  console.log(JSON.stringify(sortObjectKeys(expected), null, 2))
}

const runAssertion = () => {
  assertEquals(actual, expected)
  if (!flags[NO_MSG]) {
    console.log('all good 👍 ✅')
  }
}

if (!flags[NO_ASSERT]) {
  if (flags[HIDE_ASSERT]) {
    try {
      runAssertion()
    } catch (e) {
      throw new Error('does not match ❌')
    }
  } else {
    runAssertion()
  }
}
