tmpdir  := `mktemp`
export PATH := "./node_modules/.bin:" + env_var('PATH')
set dotenv-load

export PNPM := `which pnpm`
export NPM := `which npm`
export NPX := `which npx`
export ROOT := `pwd`

install:
  ${PNPM} install

[working-directory: 'packages/greenwood']
dev: install parse
  ${PNPM} run dev

check: install
  cd packages/starlight && ${NPX} tsc --noEmit -p .;

[working-directory: 'packages/greenwood']
build: install parse
  ${PNPM} run build

[working-directory: 'packages/assets']
parse: install
  ./bin/createCollections.sh -o "../starlight/src/content"
  ./bin/createCollections.sh -o "../greenwood/src/assets/collections"

[working-directory: 'packages/infrastructure']
deploy: parse build
  pulumi up
