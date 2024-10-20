#!/usr/bin/env bash

BUN=`which bun`
BUNX=`which bunx`

${BUN} --bun vite build || exit 1

exit 0
