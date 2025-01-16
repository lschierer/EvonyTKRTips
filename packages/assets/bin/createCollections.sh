#!/bin/bash

OPTS=$(getopt -o o: --long output: -n 'createCollections.sh' -- "$@")

if [ $? -ne 0 ]; then
        echo "Invalid usage: '$@'" >&2
        exit 1
fi

# Note the quotes around "$TEMP": they are essential!
eval set -- "$OPTS"
unset OPTS

unset -v OUTPUTDIR

while true; do
  case "$1" in
    -o | --output)
      OUTPUTDIR="$2"
      shift 2
      continue
      ;;
    --)
      shift
      break
      ;;
    *)
      echo "Unrecognized option '$1'"
      exit 2
      ;;
  esac
done

if [ -z OUTPUTDIR ]; then
  echo '-o is required' >&2
  exit 3
elif [ ! -d "$OUTPUTDIR" ]; then
  echo "OUTPUTDIR '$OUTPUTDIR' must exist"
  exit 4
else
  echo "OUTPUTDIR is '$OUTPUTDIR'"
fi

export YQ=`which yq`;

export collections="generals generalConflictGroups covenants specialities ascending art skillBooks blazons buff";

find . -type d -mindepth 1 -maxdepth 1 ! -name 'bin' ! -name 'node_modules' | while read -r line; do
  c=$(basename "$line")
  echo $c;
  if [ -d "$OUTPUTDIR/$c" ]; then
    rm -rf rm -rf "$OUTPUTDIR/$c"
  fi
  mkdir "$OUTPUTDIR/$c"

  find ./$c -type f -iname '*.yaml' -print0 | while read -r -d '' file; do
    j=`basename "$file" .yaml`;
    $YQ eval -o=json "$file" > "$OUTPUTDIR/$c/$j.json"
  done
  find "$OUTPUTDIR/$c/" -iname "*.json" -exec basename {} \+ | gsed -E 's/(.*)/"\1",/; /./{H;$!d} ; x ; s/^/const collection=[/; s/$/]; export default collection;/' > "$OUTPUTDIR/$c/collection.ts"
done
