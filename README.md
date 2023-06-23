# tree lint

This is a command-line tool. Its job is to help you organize your TypeScript projects. The philosophy of the structure is to allow you to keep all relevant files within the same hierarchy node so it's easy to break it out into its own repository. The rules for how the directories/projects work are as follows:

1. Each dir is a "project".
2. Each project can contain whatever files you want. The convention is ideally a single `mod.ts`, `test.ts` etc file.
3. Dependents of the project live as a sibling next to its `mod.ts` in a folder and so on, building a hierarchy.
4. Projects that are not used by any other project will be at the top of the tree.
5. Projects with only one usage should be nested within that project.
6. Projects that are used by more than one project are placed as a sibling of the highest (top-most) project in the tree.
7. Circular projects will be siblings.

> Note: nothing is written to disk. All that is used is the read permission `--allow-read`.

## Install

```bash
> deno install --allow-read https://deno.land/x/tree_lint/mod.ts
> tree_lint
all good 👍 ✅
```

## Options

| Flags            | Description                                                                |
|------------------|----------------------------------------------------------------------------|
| --no-type-import | When enabled imports with `import type` will not be added to the mapping.  |
| --no-abs-path    | When enabled imports will not be converted to absolute paths.              |
| --project        | When enabled will print out the project relationship object.               |
| --actual         | When enabled will print out the current directory structure.               |
| --expected       | When enabled will print out the expected directory structure.              |
| --no-assert      | When enabled will not assert.                                              |
| --hide-assert    | When enabled will not print assertion diff.                                |
| --no-msg         | When enabled will not print out success message.                           |

## How it works

Using `walk`, the project is scanned, and TypeScript files are crudely parsed using a string match for imports (nothing fancy). Each TypeScript file in the project is read and builds up a local dependency map. Here's this project's initial dependency scan:

```json
{
  "deep_traverse": [],
  "depth_first_search": [
    "process_deps"
  ],
  "parse_imports": [],
  "process_deps": [
    "depth_first_search",
    "deep_traverse",
    "shared_prefix"
  ],
  "read_project": [
    "parse_imports"
  ],
  "shared_prefix": [],
  "tree_lint": [
    "process_deps",
    "parse_imports",
    "read_project"
  ]
}
```

Using the dependency map, we build up what the relationships should be for this project.

```json
{
  "tree_lint": {
    "depth_first_search": {},
    "parse_imports": {},
    "process_deps": {
      "deep_traverse": {},
      "shared_prefix": {}
    },
    "read_project": {}
  }
}
```

The tool will "lint" that the folder structure of the project matches the projection. If so, "all good 👍 ✅". If not, you have to move files and folders around manually to get them to match.
