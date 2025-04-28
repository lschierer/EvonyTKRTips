#!/bin/bash

EXPORTDIR='./dist/collections';

if [ -d "$EXPORTDIR" ]; then
  rm -rf "$EXPORTDIR";
fi
mkdir -p "$EXPORTDIR";

export YQ=$(which yq)

export collections="generals generalConflictGroups covenants specialities ascendingAttributes art skillBooks blazons buff"

for line in ${collections[@]}; do
  c=$(basename "$line")
  echo $c

  mkdir "$EXPORTDIR/$c"

  find ./$c -type f -iname '*.yaml' -print0 | while read -r -d '' file; do
    j=$(basename "$file" .yaml)
    $YQ eval -o=json "$file" > "$EXPORTDIR/$c/$j.json"
  done
  find "$EXPORTDIR/$c/" -iname "*.json" -exec basename {} \+ | gsed -E 's/(.*)/"\1",/; /./{H;$!d} ; x ; s/^/const collection=[/; s/$/]; export default collection;/' > "$EXPORTDIR/$c/collection.ts"
done

find "$EXPORTDIR" -iname '*.ts' | while read -r line; do
  BASE=`basename "$line" .ts`
  FULLDIR=`dirname "$line"`
  DIR=`basename $FULLDIR`
  echo "export * as $DIR from './$DIR/$BASE.ts'" >> "$EXPORTDIR/index.ts"
done
