BUN := `which bun`
BUNX := `which bunx`

backend-build:
  {{BUN}} --bun vite build || exit 1

backend-dev:
  cd backend && {{BUN}} run --hot src/index.ts &

frontend-dev:
  cd frontend && {{BUN}} vite

frontend-preview:
  cd frontend && {{BUN}} vite preview

frontend-build:
  cd frontend && vite build

check: checkFrontend

checkFrontend:
  cd frontend && tsc

build: backend-build frontend-build
