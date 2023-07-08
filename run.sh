
deno run --allow-read ./tree_lint/tree_lint_cmd/mod.ts ./ \
  --extensions .ts \
  --flipRelationFiles '^test\.(ts|tsx)$' \
  --keepFiles '^mod\.(ts|tsx)$' \
  --keepFiles '^test\.(ts|tsx)$' \
  --keepFiles '^types\.(ts|tsx)$' \
  --promoteNode 'tree_lint/mod.ts$' \
  --useDynamicRoots \
  --indexName mod \
  --expected
