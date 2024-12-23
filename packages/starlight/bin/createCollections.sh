#!/usr/bin/env bash -x

export YQ=`which yq`;

export collections="generals generalConflictGroups covenants specialities ascending art skillBooks blazons buff";

for c in $collections; do
  echo $c;
  if [ -d ./src/content/$c ]; then
    rm -rf rm -rf ./src/content/$c
  fi
  mkdir ./src/content/$c

  find ./src/assets/$c -type f -iname '*.yaml' -print0 | while read -r -d '' file; do
    j=`basename "$file" .yaml`;
    $YQ eval -o=json "$file" > "./src/content/$c/$j.json"
  done
  if [ ! -e ./src/schemas/$c.ts ]; then
    pnpm quicktype -l typescript-zod --src ./src/content/$c/  -o ./src/schemas/$c.ts
    gsed -i -E 's/Schema//g' ./src/schemas/$c.ts
  fi
done
