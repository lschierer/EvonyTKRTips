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
  mkdir "$EXPORTDIR";
fi

export YQ=$(which yq)

export collections="generals generalConflictGroups covenants specialities ascending art skillBooks blazons buff"

find . -type d -mindepth 1 -maxdepth 1 ! -name 'bin' ! -name 'node_modules' ! -name 'exports' ! -name 'monster_reports' | while read -r line; do
  c=$(basename "$line")
  echo $c
  if [ -d "$OUTPUTDIR/$c" ]; then
    rm -rf rm -rf "$OUTPUTDIR/$c"
  fi
  mkdir "$OUTPUTDIR/$c"
  mkdir "$EXPORTDIR/$c"

  find ./$c -type f -iname '*.yaml' -print0 | while read -r -d '' file; do
    j=$(basename "$file" .yaml)
    $YQ eval -o=json "$file" > "$EXPORTDIR/$c/$j.json"
  done
  find "$EXPORTDIR/$c/" -iname "*.json" -exec basename {} \+ | gsed -E 's/(.*)/"\1",/; /./{H;$!d} ; x ; s/^/const collection=[/; s/$/]; export default collection;/' > "$OUTPUTDIR/$c/collection.ts"
  find "$EXPORTDIR/$c/" -iname "*.json" -exec basename {} \+ | gsed -E 's/(.*)/"\1",/; /./{H;$!d} ; x ; s/^/const collection=[/; s/$/]; export default collection;/' > "$EXPORTDIR/$c/collection.ts"
done

find "$EXPORTDIR" -iname '*.ts' | while read -r line; do
  BASE=`basename "$line" .ts`
  FULLDIR=`dirname "$line"`
  DIR=`basename $FULLDIR`
  echo "export * as $DIR from './$DIR/$BASE.ts'" >> "$EXPORTDIR/index.ts"
done
