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

# Clear index.ts file
> "$SRCDIR/index.ts"

find collections -type d -maxdepth 1 -mindepth 1 | while read -r collection_path; do
  # Get the original directory name with spaces
  c=$(basename "$collection_path")
  echo "Processing collection: '$c'"

  # Create a version without spaces for the output directory
  filename=$(echo "$c" | tr -d '[:blank:]')

  mkdir -p "$EXPORTDIR/$filename"
  mkdir -p "$SRCDIR/$filename"

  # Process YAML files, preserving spaces in filenames
  find "$collection_path" -type f -iname '*.yaml' -print0 | while IFS= read -r -d '' file; do
    j=$(basename "$file" .yaml)
    $YQ eval -o=json "$file" > "$EXPORTDIR/$filename/$j.json"
  done

  # Create the collection.ts file
  find "$EXPORTDIR/$filename/" -type f -iname "*.json" -print0 | xargs -0 basename -a | \
    gsed -E 's/(.*)/"\1",/; /./{H;$!d} ; x ; s/^/const collection=[/; s/$/]; export default collection;/' > "$SRCDIR/$filename/collection.ts"
done

# Generate index.ts with proper exports
find "$SRCDIR" -type f -iname '*.ts' -not -path "$SRCDIR/index.ts" | while IFS= read -r line; do
  BASE=$(basename "$line" .ts)
  FULLDIR=$(dirname "$line")
  DIRVAR=$(basename "$FULLDIR" | tr -d '[:blank:]')
  DIR=$(basename "$FULLDIR")
  echo "export * as $DIRVAR from './$DIR/$BASE'" >> "$SRCDIR/index.ts"
done
