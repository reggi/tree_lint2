import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { Node, Nodes } from "./mod.ts";

Deno.test("Node class", () => {
  const node = new Node("/path/to/file.txt");

  assertEquals(node.value, "/path/to/file.txt");
  assertEquals(node.basename, "file.txt");
  assertEquals(node.dirname, "/path/to");
  assertEquals(node.parentDirname, "to");
  assertEquals(node.split, ["", "path", "to", "file.txt"]);
  assertEquals(node.rootDirname, "");
  assertEquals(node.matchNode("file.txt"), true);
  assertEquals(node.matchBasename("file.txt"), true);
  assertEquals(node.matchDirname("to"), true);
  assertEquals(node.matchParentDirname("to"), true);
  assertEquals(node.matchRootDirname(""), true);
  assertEquals(node.match({ node: "file.txt" }), true);
});

Deno.test("Nodes class", () => {
  const nodes = new Nodes([
    "/path/to/file1.txt",
    "/path/to/file2.txt",
    "/path/to/file3.txt",
    "/path/to/file1.txt",
  ]);

  const uniqueNodes = nodes.unique();
  assertEquals(uniqueNodes.value, [
    "/path/to/file1.txt",
    "/path/to/file2.txt",
    "/path/to/file3.txt",
  ]);

  const filteredNodes = nodes.filter((node) => node.matchBasename("file1.txt"));
  assertEquals(filteredNodes.value, ["/path/to/file1.txt", "/path/to/file1.txt"]);

  const mappedNodes = nodes.map((node) => node.dirname);
  assertEquals(mappedNodes, [
    "/path/to",
    "/path/to",
    "/path/to",
    "/path/to",
  ]);

  const reducedNodes = nodes.reduce((acc, node) => acc + node.basename, "");
  assertEquals(reducedNodes, "file1.txtfile2.txtfile3.txtfile1.txt");
});