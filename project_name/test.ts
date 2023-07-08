import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts"
import { projectName } from "./mod.ts"

let count = 0
const harness = (opts: {
  filePath: string,
  keepFiles?: string[]
  indexName?: string | string[],
  expectedFile: string,
  expectedDir: string
}) => {
  count++
  Deno.test(`projectName test ${count}`, () => {
    const { file, dir } = projectName(opts.filePath, opts)
    assertEquals(file, opts.expectedFile)
    assertEquals(dir, opts.expectedDir)
  })
}

harness({
  filePath: '/root/parseInt.ts',
  expectedFile: 'parseInt.ts',
  expectedDir: 'parseInt'
})

harness({
  filePath: '/root/parseInt.ts',
  indexName: 'mod',
  expectedFile: 'mod.ts',
  expectedDir: 'parseInt'
})

harness({
  filePath: '/root/parseInt/mod.ts',
  keepFiles: ['^mod\\.ts$'],
  expectedFile: 'mod.ts',
  expectedDir: 'parseInt'
})

harness({
  filePath: '/root/parseInt.test.ts',
  expectedFile: 'test.ts',
  expectedDir: 'parseInt'
})

harness({
  filePath: '/root/src/project/alpha/index.ts',
  indexName: ['mod', 'index'],
  expectedFile: 'mod.ts',
  expectedDir: 'alpha'
})

harness({
  filePath: '/root/src/project/alpha/mod.ts',
  indexName: ['mod'],
  expectedFile: 'mod.ts',
  expectedDir: 'alpha'
})

harness({
  filePath: '/root/src/project/alpha/mod.ts',
  expectedFile: 'mod.ts',
  expectedDir: 'mod'
})

harness({
  filePath: '/root/src/project/alpha/index.ts',
  expectedFile: 'index.ts',
  expectedDir: 'index'
})