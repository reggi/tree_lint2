export * from "./types.ts";
import { Matches } from "./types.ts";
import { KeyPrefixer, extractPrefixedProps } from "../extract_prefixed_props/mod.ts";

export type ExcludeMatches = KeyPrefixer<'exclude', Matches>;
export type PromoteMatches = KeyPrefixer<'promote', Matches>;

export const extractExcludeMatches =(obj?: ExcludeMatches) => obj ? extractPrefixedProps('exclude', obj) : {};
export const extractPromoteMatches = (obj?: PromoteMatches) => obj ? extractPrefixedProps('promote', obj) : {};