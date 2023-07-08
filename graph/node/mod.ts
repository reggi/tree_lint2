import path from 'node:path'
import { FactoryIterable } from "../../factory_iterable/mod.ts";
import { Edge, Edges } from "../edge/mod.ts";
import { Matches } from '../../matches/types.ts';

const [ProtoNode, ProtoNodes] = FactoryIterable<string, string, Edge | Edges>({
  multipleConverter: (value: string | string[] | Edge | Edges): string[] => {
    if (value instanceof Edges) {
      return value.value.flat()
    } else if (value instanceof Edge) {
      return value.value;
    } else if (Array.isArray(value)) {
      return value;
    } else if (typeof value === "string") {
      return [value];
    }
    throw new Error("Invalid value");
  },
})

export class Node extends ProtoNode {
  get basename () {
    return path.basename(this.value)    
  }
  get dirname () {
    return path.dirname(this.value)    
  }
  get parentDirname () {
    return path.basename(this.dirname)
  }
  get split () {
    return this.value.split(path.sep)
  }
  get rootDirname () {
    return this.split[0]
  }
  static nodeOrString (node: Node | string) {
    return node instanceof Node ? node.value : node
  }
  runMatch (value: string, matches?: string | string[]) {
    const run = (v: string) => Boolean(value.match(new RegExp(v)))
    return Array.isArray(matches) ? matches.some(run) : matches !== undefined ? run(matches) : false
  }
  matchNode (value?: string | string[]) {
    return this.runMatch(this.value, value)
  }
  matchBasename (value?: string | string[]) {
    return this.runMatch(this.basename, value)
  }
  matchDirname (value?: string | string[]) {
    return this.runMatch(this.dirname, value)
  }
  matchParentDirname (value?: string | string[]) {
    return this.runMatch(this.parentDirname, value)
  }
  matchRootDirname (value?: string | string[]) {
    return this.runMatch(this.rootDirname, value)
  }
  match (matches?: Matches) {
    if (!matches) return false
    return Boolean(
      this.matchBasename(matches.basenames) || 
      this.matchDirname(matches.dirnames) || 
      this.matchParentDirname(matches.parentDirnames) ||
      this.matchRootDirname(matches.rootDirnames) ||
      this.matchNode(matches.node)
    )
  }
}

export class Nodes extends ProtoNodes<typeof Node, typeof Nodes> {
  arrayMethods = this.generate(Node, Nodes)

  unique () {
    return new Nodes(Array.from([...new Set(this.value)]))
  }
}