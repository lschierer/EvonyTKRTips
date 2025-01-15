tmpdir  := `mktemp`
export PATH := "./node_modules/.bin:" + env_var('PATH')
set dotenv-load

export PNPM := `which pnpm`
export NPM := `which npm`
export NPX := `which npx`

install:
  ${PNPM} install

dev: install parse
  cd packages/starlight && ${PNPM} run dev

check: install
  cd packages/starlight && ${NPX} tsc --noEmit -p .;

build: install parse
  cd packages/starlight && ${PNPM} run build

parse: install
  cd packages/assets && ./bin/createCollections.sh -o ../starlight/src/content/


deploy: build
  cd infrastructure && pulumi up
