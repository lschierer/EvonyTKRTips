#!/bin/bash

EXPORTDIR='./dist/collections';
SRCDIR='./src/collections';

if [ -d "$EXPORTDIR" ]; then
  rm -rf "$EXPORTDIR";
  rm -rf "$SRCDIR";
fi
mkdir -p "$EXPORTDIR";
mkdir -p "$SRCDIR";

export YQ=$(which yq)

export collections="generals generalConflictGroups covenants specialities ascendingAttributes art skillBooks blazons buff"

for line in ${collections[@]}; do
  c=$(basename "$line")
  echo $c

  mkdir "$EXPORTDIR/$c"
  mkdir "$SRCDIR/$c"

  find ./$c -type f -iname '*.yaml' -print0 | while read -r -d '' file; do
    j=$(basename "$file" .yaml)
    $YQ eval -o=json "$file" > "$EXPORTDIR/$c/$j.json"
  done
  find "$EXPORTDIR/$c/" -iname "*.json" -exec basename {} \+ | gsed -E 's/(.*)/"\1",/; /./{H;$!d} ; x ; s/^/const collection=[/; s/$/]; export default collection;/' > "$SRCDIR/$c/collection.ts"
done

find "$SRCDIR" -iname '*.ts' | while read -r line; do
  BASE=`basename "$line" .ts`
  FULLDIR=`dirname "$line"`
  DIR=`basename $FULLDIR`
  echo "export * as $DIR from './$DIR/$BASE'" >> "$SRCDIR/index.ts"
done
