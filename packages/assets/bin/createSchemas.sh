#!/bin/bash -x

OPTS=$(getopt -o i:o: --long input:,output: -n 'createSchemas.sh' -- "$@")

if [ $? -ne 0 ]; then
  echo "Invalid usage: '$@'" >&2
  exit 1
fi

# Note the quotes around "$TEMP": they are essential!
eval set -- "$OPTS"
unset OPTS

unset -v INPUTDIR
unset -v OUTPUTDIR

while true; do
  case "$1" in
    -i | --input)
      INPUTDIR="$2"
      shift 2
      continue
      ;;
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

if [ -z INPUTDIR ]; then
  echo '-i is required' >&2
  exit 3
elif [ ! -d "$INPUTDIR" ]; then
  echo "INPUTDIR '$INPUTDIR' must exist"
  exit 4
else
  echo "INPUTDIR is '$INPUTDIR'"
fi

if [ -z OUTPUTDIR ]; then
  echo '-o is required' >&2
  exit 5
elif [ ! -d "$OUTPUTDIR" ]; then
  echo "OUTPUTDIR '$OUTPUTDIR' must be a directory"
  exit 6
else
  shopt -s nullglob
  shopt -s dotglob
  chk_files=("${OUTPUTDIR}"/*)
  ((${#chk_files[*]})) && echo "OUTPUTDIR is '$OUTPUTDIR' is not empty " && exit 6
  shopt -u nullglob
  shopt -u dotglob
  echo "OUTPUTDIR is '$OUTPUTDIR'"
fi

find . -type d -mindepth 1 -maxdepth 1 ! -name 'bin' ! -name 'node_modules' | while read -r line; do
  echo "line is '$line'"
  export collection=$(basename "$line")

  if [ ! -e "$OUTPUTDIR/$line.ts" ]; then
    if [ -d "$INPUTDIR/$line" ]; then
      pnpm quicktype -l typescript-zod --src "$INPUTDIR/$line" -o "$OUTPUTDIR/$line.ts"
      gsed -i -E 's/Schema//g' "$OUTPUTDIR/$line.ts"
    fi
  fi
done
