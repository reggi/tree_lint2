// deno-lint-ignore-file no-explicit-any  

// export function pruneCircular2(input: any) {
//   return (function pruneHelper(node: any, ancestors: any[] = []) {
//     if (node && typeof node === 'object') {
//       if (ancestors.includes(node)) {
//         return null;
//       }
//       let newAncestors = [...ancestors, node];
//       let clone: any = Array.isArray(node) ? [] : {};
//       for (let key in node) {
//         if (node[key] && typeof node[key] === 'object') {
//           let child = pruneHelper(node[key], newAncestors);
//           if (child !== null) {
//             clone[key] = child;
//           }
//         } else {
//           clone[key] = node[key];
//         }
//       }
//       return clone;
//     }
//     return node;
//   })(input);
// }

// export function pruneCircular(input: any) {
//   return (function pruneHelper(node: any, ancestors: any[] = []) {
//     if (node && typeof node === 'object') {
//       if (ancestors.includes(node)) {
//         return null;
//       }
//       const newAncestors = [...ancestors, node];
//       const clone: any = Array.isArray(node) ? [] : {};

//       for (const key in node) {
//         if (key === '$') {
//           clone[key] = node[key];
//           continue;
//         }

//         if (node[key] && typeof node[key] === 'object') {
//           const child = pruneHelper(node[key], newAncestors);
//           if (child !== null) {
//             clone[key] = child;
//           }
//         } else {
//           clone[key] = node[key];
//         }
//       }

//       if (Array.isArray(node)) {
//         node.length = 0;
//         Object.assign(node, clone);
//         return node;
//       }

//       Object.keys(node).forEach((key) => delete node[key]);
//       Object.assign(node, clone);
//       return node;
//     }
//     return node;
//   })(input);
// }

export function pruneCircular(input: any, ignoredKeys: string[] = []) {
  return (function pruneHelper(node: any, ancestors: any[] = []) {
    if (node && typeof node === 'object') {
      if (ancestors.includes(node)) {
        return null;
      }
      const newAncestors = [...ancestors, node];
      const clone: any = Array.isArray(node) ? [] : {};

      for (const key in node) {
        if (ignoredKeys.includes(key)) {
          clone[key] = node[key];
          continue;
        }

        if (node[key] && typeof node[key] === 'object') {
          const child = pruneHelper(node[key], newAncestors);
          if (child !== null) {
            clone[key] = child;
          }
        } else {
          clone[key] = node[key];
        }
      }

      if (Array.isArray(node)) {
        node.length = 0;
        Object.assign(node, clone);
        return node;
      }

      Object.keys(node).forEach((key) => delete node[key]);
      Object.assign(node, clone);
      return node;
    }
    return node;
  })(input);
}
