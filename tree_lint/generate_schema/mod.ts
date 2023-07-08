import * as flags from "https://deno.land/std@0.193.0/flags/mod.ts";

export function generateFlags(definitions: string[]) {
  const __string: string[] = []
  const __collect: string[] = []
  const __boolean: string[] = []
  definitions.forEach(def => {
    const [key, types] = def.split(/:/).map(str => str.replace('?', '').trim());
    const possibleTypes = types.split('|').map(str => str.trim());
    const isStringConst = possibleTypes.filter(v => v.match(/^"(.+)"$/))
    const isBoolean = possibleTypes.includes('boolean');
    const isString = possibleTypes.includes('string');
    const isCollect = possibleTypes.includes('string[]');
    if (isCollect) {
      __collect.push(key);
    } else if (isString || isStringConst.length) {
      __string.push(key);
    } else if (isBoolean) {
      __boolean.push(key);
    }
  });
  return (args: string[]) => {
    return flags.parse(args, {
      boolean: __boolean,
      string: __string,
      collect: __collect
    });
  }
}
