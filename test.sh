#!/usr/bin/env bash
set -euo pipefail

# Robust cleanup to avoid orphan preview process
cleanup() {
  if [[ -n "${PREVIEW_PID:-}" ]]; then
    kill -9 "$PREVIEW_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

echo "[1/4] Build (skip postbuild)"
npx -y vite build

echo "[2/4] Start preview on :5173 (background)"
npx -y vite preview --port 5173 --strictPort >/dev/null 2>&1 &
PREVIEW_PID=$!

echo "[3/4] Wait for preview to be ready..."
READY=""
for i in $(seq 1 30); do
  if curl -sSf http://localhost:5173 >/dev/null; then
    READY=1
    break
  fi
  sleep 1
done
if [[ -z "$READY" ]]; then
  echo "Preview server not ready after 30s" >&2
  exit 1
fi

echo "[4/4] Run CSP tests with short timeout"
npx -y playwright test tests/csp.spec.js \
  -c playwright.csp.config.ts \
  --timeout=20000

echo "Done."
