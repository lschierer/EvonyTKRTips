#!/bin/bash

while getopts ":o:" opt; do
  case "$opt" in
    o)
      OUTPUTDIR="$OPTARG"
      shift 2
      continue
      ;;
    \?)
      echo "Unrecognized option '$1'"
      exit 2
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

shift $((OPTIND - 1))

if [ -z OUTPUTDIR ]; then
  echo '-o is required' >&2
  exit 3
elif [ ! -d "$OUTPUTDIR" ]; then
  echo "OUTPUTDIR '$OUTPUTDIR' must exist"
  echo $(pwd)
  exit 4
else
  echo "OUTPUTDIR is '$OUTPUTDIR'"
fi

EXPORTDIR='./exports';

if [ -d "$EXPORTDIR" ]; then
  rm -rf "$EXPORTDIR";
fi
mkdir "$EXPORTDIR";

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

rsync -a --delete "$EXPORTDIR/" "$OUTPUTDIR/"
