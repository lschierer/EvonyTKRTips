#!/bin/bash -x

EXPORTDIR='./dist/collections';
SRCDIR='./src/collections';

if [ -d "$EXPORTDIR" ]; then
  rm -rf "$EXPORTDIR";
  rm -rf "$SRCDIR";
fi
mkdir -p "$EXPORTDIR";
mkdir -p "$SRCDIR";

export YQ=$(which yq)

find collections -type d -maxdepth 1 -mindepth 1 -exec basename {} \; | while read -r line;  do
  echo "line is '$line'"
  c=$(basename "$line")
  echo "c is '$c'"

  mkdir "$EXPORTDIR/$c"
  mkdir "$SRCDIR/$c"

  find "./collections/$c" -type f -iname '*.yaml' -print0 | while read -r -d '' file; do
    j=$(basename "$file" .yaml)
    $YQ eval -o=json "$file" > "$EXPORTDIR/$c/$j.json"
  done
  find "$EXPORTDIR/$c/" -iname "*.json" -exec basename "{}" \+ | gsed -E 's/(.*)/"\1",/; /./{H;$!d} ; x ; s/^/const collection=[/; s/$/]; export default collection;/' > "$SRCDIR/$c/collection.ts"
done

find "$SRCDIR" -iname '*.ts' | while read -r line; do
  BASE=`basename "$line" .ts`
  FULLDIR=`dirname "$line"`
  DIRVAR=`basename "$FULLDIR" | tr -d '[:blank:]'`
  DIR=`basename "$FULLDIR"`
  echo "export * as $DIRVAR from './$DIR/$BASE'" >> "$SRCDIR/index.ts"
done
