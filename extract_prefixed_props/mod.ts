
export type KeyPrefixer<T extends string, U> = {
  [K in keyof U as `${T}${Capitalize<string & K>}`]?: U[K]
};

// deno-lint-ignore no-explicit-any
export type InferObjectFromPrefixer<T> = T extends KeyPrefixer<any, infer U> ? U : never;

// deno-lint-ignore no-explicit-any
export function extractPrefixedProps<T extends string, U extends KeyPrefixer<T, any>>(
  prefix: T, 
  obj: U
): InferObjectFromPrefixer<U> {
  const result: Partial<InferObjectFromPrefixer<U>> = {};
  for (const key in obj) {
    if (key.startsWith(prefix)) {
      // remove prefix and lowercase the first character
      const newKey = key.slice(prefix.length);
      const lowerCasedKey = newKey.charAt(0).toLowerCase() + newKey.slice(1);
      // deno-lint-ignore no-explicit-any
      result[lowerCasedKey as keyof InferObjectFromPrefixer<U>] = obj[key as keyof U] as any;
    }
  }
  return result as InferObjectFromPrefixer<U>;
}