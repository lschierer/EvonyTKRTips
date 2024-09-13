#!/bin/sh 

VERSION=4;

echo "Executing Game::EvonyTKR build script ${VERSION}";

if [ -d packages/backend/]; then
  cd packages/backend/

  if [ -f *.tar.gz ]; then
    rm *.tar.gz;
  fi

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

  echo '---- build complete ----';

else
  pwd
fi