#!/bin/bash -x 

VERSION=5;

TOOL_NAME='EvonyTKRTipsBuildScript'

PNPM=`which pnpm`;


# --- functions ---


perl_build() {
  if [ -d ./packages/backend/ ]; then

    if [ -f ./bin/minicpan ]; then
      ./bin/minicpan &
    else 
      exit 1
    fi

    cd ./packages/backend/

    CPM=`which cpm`;
    echo ${CPM};

    ${CPM} install -g Software::License::CC_BY_4_0 || exit 2

    ${CPM} install -g --with-runtime --with-recommends Dist::Zilla || exit 1
    ${CPM} install -g --with-runtime --with-recommends Dist::Zilla::App::Command::authordeps || exit 1
    ${CPM} install -g --with-runtime --with-recommends Dist::Zilla::App::Command::listdeps || exit 1

    DZIL=`which dzil`;

    for i in `grep authordep dist.ini  | cut -d ' ' -f 3`; do 
        ${CPM} install --with-runtime --with-recommends -g ${i} || exit 2
        echo;
    done

    echo '---- author deps complete ----';

    DEPS=`${DZIL} listdeps --missing | grep -v ^builtin | sort`
    if [ ! -z "${DEPS}" ]; then
      echo $DEPS | ${CPM} install -g --with-runtime --with-recommends --feature=accelerate 
    fi

    echo '---- standard deps complete ----';

    ${DZIL} build
    ${DZIL} release

    cd ../..
    TARBALL=`ls -1 -ctr --color=none ./var/mirrors/minicpan/authors/id/L/LS/LSCHIERER/Game-EvonyTKR-*.tar.gz | tail -n 1`

    if [ -f "${TARBALL}" ]; then 
      rm ./var/*.tar.gz
      cp ${TARBALL} ./var/
    else
      echo "release tarball not found"
      exit 4
    fi

    echo '---- build complete ----';

  else
    pwd && exit 1
  fi
}

usage(){
>&2 cat << EOF
Usage: $0
   [ --deploy ]
   [ --dev ]
EOF
exit 1
}

# --- end functions ---

echo "Executing Game::EvonyTKR build script ${VERSION}";

PARSED_ARGUMENTS=$(getopt -n ${TOOL_NAME} -o '' --long deploy,dev -- "$@")

VALID_ARGUMENTS=$?

if [ "$VALID_ARGUMENTS" != "0" ]; then
  usage
fi

echo "PARSED_ARGUMENTS is $PARSED_ARGUMENTS"

eval set -- "$PARSED_ARGUMENTS"
while : 
do
  echo "1 is $1";
  set -e ;
  case $1 in
    --deploy) 
      echo 'executing in build mode';
      perl_build
      ${PNPM} sst deploy 
      exit 0;
      shift;
      ;;
    --dev)
      echo 'executing in dev mode';
      perl_build;
      ${PNPM} dev
      exit 0;
      shift;
      ;;
    --)
      shift;
      break
      ;;
    *) >&2 echo Unsupported option: $1
      usage
      ;;
  esac
done
