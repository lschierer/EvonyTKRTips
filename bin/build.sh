#!/bin/sh 

VERSION=4;

echo "Executing Game::EvonyTKR build script ${VERSION}";

if [ -d ../../packages/backend/ ]; then
  cd ../../packages/backend/

  MINICPAN=`which minicpan`

  if [ -z MINICPAN ]; then
    exit 1;
  fi

  ${MINICPAN} &

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

  ${DZIL} listdeps --missing | sort |grep -v ^builtin | ${CPM} install -g --with-runtime --with-recommends --feature=accelerate 

  echo '---- standard deps complete ----';

  ${DZIL} build
  ${DZIL} release

  TARBALL=`ls -1 -lctr --color=none ../../var/mirrors/minicpan/authors/id/L/LS/LSCHIERER/Game-EvonyTKR-*.tar.gz | tail -n 1`

  if [ -f ${TARBALL} ]; then 
    mv ${TARBALL} .
  else
    echo "release tarball not found"
    exit 4
  fi

  echo '---- build complete ----';

else
  pwd && exit 1
fi