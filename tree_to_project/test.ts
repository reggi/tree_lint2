import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { treeToProject, ProjectNameOptions } from "./mod.ts";

Deno.test("treeToProject flat", () => {
  const tree = {
    "/root/src/project/alpha/mod.ts": {},
    "/root/src/project/beta/mod.ts": {},
    "/root/src/project/gamma/mod.ts": {}
  };

  const opts: ProjectNameOptions = {
    keepFiles: ["^mod\\.(ts|tsx)$"],
    indexName: "mod",
  }; 

  const result = treeToProject(tree, opts);

  assertEquals(result, {
    alpha: { 'mod.ts': {} },
    beta: { 'mod.ts': {} },
    gamma: { 'mod.ts': {} }
  });
});

Deno.test("treeToProject nested", () => {
  const tree = {
    "/root/src/project/alpha/mod.ts": {
      "/root/src/project/beta/mod.ts": {
        "/root/src/project/gamma/mod.ts": {}
      },
    },
  };

  const opts: ProjectNameOptions = {
    keepFiles: ["^mod\\.(ts|tsx)$"],
    indexName: "mod",
  };

  const result = treeToProject(tree, opts);

  assertEquals(result, {
  alpha: { 
    'mod.ts': {},
    beta: { 
      'mod.ts': {} ,
      gamma: {
        'mod.ts': {}
      }
    }
  }})
});

Deno.test("treeToProject extra file", () => {
  const tree = {
    "/root/src/project/alpha/mod.ts": {
      "/root/src/project/beta/mod.ts": {
        "/root/src/project/gamma/mod.ts": {},
        "/root/src/project/beta/test.ts": {},
      },
    },
  };

  const opts: ProjectNameOptions = {
    keepFiles: ["^mod\\.(ts|tsx)$", "^test\\.(ts|tsx)$"],
    indexName: "mod",
  };

  const result = treeToProject(tree, opts);

  assertEquals(result, {
    alpha: { 
      'mod.ts': {},
      beta: { 
        'mod.ts': {},
        'test.ts': {},
        gamma: {
          'mod.ts': {}
        }
      }
    }
  })

});

Deno.test("treeToProject with object structure", () => {
  const tree = {
    "/root/src/components/button.ts": {},
    "/root/src/components/input.ts": {
      "/root/src/utils/helper.ts": {},
    },
  };

  const opts: ProjectNameOptions = {
    keepFiles: ["^mod\\.(ts|tsx)$"],
    indexName: "mod",
  };

  const result = treeToProject(tree, opts);

  assertEquals(result, {
    button: {
      'mod.ts': {}
    },
    input: {
      'mod.ts': {},
      helper: {
        'mod.ts': {}
      }
    },
  });
});
