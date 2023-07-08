import { assertEquals } from 'https://deno.land/std@0.192.0/testing/asserts.ts';
import { TestDirectory } from '../test_directory/mod.ts';
import { parseFilesSync } from './mod.ts';

Deno.test({
  name: "parseFilesSync function",
  fn: () => {
    const test = new TestDirectory({
      "file1.ts": `import { a } from "./file2.ts";`,
      'file2.ts': `import { b } from "./file3.ts";`,
      'file3.ts': ``
    });

    const expectedTree = {
      [test.getKey("file1.ts")]: [
        test.getKey("file2.ts"),
      ],
      [test.getKey("file2.ts")]: [
        test.getKey("file3.ts")
      ],
      [test.getKey("file3.ts")]: []
    };

    const actualTree = parseFilesSync(test.absKeys);

    assertEquals(actualTree, expectedTree);

    test.cleanup();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
