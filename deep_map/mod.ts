// deno-lint-ignore-file no-explicit-any

import { deepSpread } from "../deep_spread/mod.ts";

type StringPredi = (key: string, value: any) => { [key: string]: any };

export function deepMapStringKeys(obj: any, predicate: StringPredi): any {
  return Object.entries(obj).reduce((acc: any, [k, v]) => {
    if (v && typeof v === 'object') {
      const value = deepMapStringKeys(v, predicate);
      return deepSpread(acc, predicate(k, value))
    } else {
      return deepSpread(acc, predicate(k, v))
    }
  }, {});
}

type Predi = (key: symbol | string, value: any) => { [key: string]: any };

export function deepMap(obj: any, predicate: Predi): any {
  let result = deepMapStringKeys(obj, predicate)

  const symbols = Object.getOwnPropertySymbols(obj);
  for (const symbol of symbols) {
    const v = obj[symbol];
    if (v && typeof v === 'object') {
      const value = deepMap(v, predicate);
      result = deepSpread(result, predicate(symbol, value));
    } else {
      result = deepSpread(result, predicate(symbol, v));
    }
  }

  return result;
}
