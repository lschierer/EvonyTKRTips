tmpdir  := `mktemp`
export PATH := "./node_modules/.bin:" + env_var('PATH')
set dotenv-load

export PNPM := `which pnpm`
export ROOT := `pwd`

install:
  ${PNPM} install

[working-directory: 'packages/greenwood']
dev: install parse build-schemas
  ${PNPM} run dev

check: install
  cd packages/starlight && ${NPX} tsc --noEmit -p .;

[working-directory: 'packages/greenwood']
build: install parse build-schemas
  ${PNPM} build

[working-directory: 'packages/assets']
parse: install
  ./bin/createCollections.sh
  ${PNPM} build

[working-directory: 'packages/schemas']
build-schemas:
  ${PNPM} build

[working-directory: 'packages/infrastructure']
deploy: parse build
  pulumi up
