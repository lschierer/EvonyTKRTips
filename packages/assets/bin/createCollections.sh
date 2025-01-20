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

export YQ=$(which yq)

export collections="generals generalConflictGroups covenants specialities ascending art skillBooks blazons buff"

find . -type d -mindepth 1 -maxdepth 1 ! -name 'bin' ! -name 'node_modules' | while read -r line; do
  c=$(basename "$line")
  echo $c
  if [ -d "$OUTPUTDIR/$c" ]; then
    rm -rf rm -rf "$OUTPUTDIR/$c"
  fi
  mkdir "$OUTPUTDIR/$c"

  find ./$c -type f -iname '*.yaml' -print0 | while read -r -d '' file; do
    j=$(basename "$file" .yaml)
    $YQ eval -o=json "$file" > "$OUTPUTDIR/$c/$j.json"
  done
  find "$OUTPUTDIR/$c/" -iname "*.json" -exec basename {} \+ | gsed -E 's/(.*)/"\1",/; /./{H;$!d} ; x ; s/^/const collection=[/; s/$/]; export default collection;/' > "$OUTPUTDIR/$c/collection.ts"
done
