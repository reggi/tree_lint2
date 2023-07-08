import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { Matches, ExcludeMatches, PromoteMatches, extractExcludeMatches, extractPromoteMatches } from "./mod.ts";

Deno.test("extractExcludeMatches function", () => {
  const excludeMatches: ExcludeMatches = {
    excludeBasenames: ["basename1", "basename2"],
    excludeDirnames: "dirname",
    excludeParentDirnames: ["parentDirname1", "parentDirname2"],
    excludeRootDirnames: "rootDirname",
    excludeNode: ["node1", "node2"],
  };

  const extracted = extractExcludeMatches(excludeMatches);

  const expected: Matches = {
    basenames: ["basename1", "basename2"],
    dirnames: "dirname",
    parentDirnames: ["parentDirname1", "parentDirname2"],
    rootDirnames: "rootDirname",
    node: ["node1", "node2"]
  };

  assertEquals(extracted, expected);
});

Deno.test("extractPromoteMatches function", () => {
  const promoteMatches: PromoteMatches = {
    promoteBasenames: "basename",
    promoteDirnames: ["dirname1", "dirname2"],
    promoteParentDirnames: "parentDirname",
    promoteRootDirnames: ["rootDirname1", "rootDirname2"],
    promoteNode: "node",
  };

  const extracted = extractPromoteMatches(promoteMatches);

  const expected: Matches = {
    basenames: "basename",
    dirnames: ["dirname1", "dirname2"],
    parentDirnames: "parentDirname",
    rootDirnames: ["rootDirname1", "rootDirname2"],
    node: "node"
  };

  assertEquals(extracted, expected);
});