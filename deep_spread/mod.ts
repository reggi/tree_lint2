// // deno-lint-ignore-file no-explicit-any
// export function deepSpread<T extends Record<string, any>, S extends Record<string, any>>(target: T, source: S): T & S {
//   if (typeof target !== 'object' || typeof source !== 'object') {
//     return source as T & S;
//   }
//   const result = { ...target };
//   for (const key in source) {
//     if (Object.prototype.hasOwnProperty.call(source, key)) {
//       result[key as keyof T] = deepSpread(target[key as keyof T], source[key]);
//     }
//   }
//   return result as T & S
// }

// deno-lint-ignore-file no-explicit-any
export function deepSpread<T extends Record<string | symbol, any>, S extends Record<string | symbol, any>>(target: T, source: S): T & S {
  if (typeof target !== 'object' || typeof source !== 'object') {
    return source as T & S;
  }
  
  const result = { ...target };
  
  // Spread String properties
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      result[key as keyof T] = deepSpread(target[key as keyof T], source[key]);
    }
  }

  // Spread Symbol properties
  const symbols = Object.getOwnPropertySymbols(source);
  for (const symbol of symbols) {
    result[symbol as keyof T] = deepSpread(target[symbol as keyof T], source[symbol]);
  }
  
  return result as T & S;
}
