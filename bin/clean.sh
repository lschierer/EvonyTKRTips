#!/bin/sh

LOCATION=$( dirname -- "${BASH_SOURCE[0]}" );

if [ -d $LOCATION/../.vscode/ ]; then
  find $LOCATION/../.vscode/ -type d -iname .build -delete
else 
  echo $LOCATION
fi

if [ -f packages/backend/dist.ini ]; then
  dzil clean
fi
