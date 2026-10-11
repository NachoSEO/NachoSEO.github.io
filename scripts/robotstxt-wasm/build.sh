#!/usr/bin/env bash
# Compila el parser oficial de robots.txt de Google a WebAssembly.
# Requiere Emscripten activo (emsdk: ./emsdk install latest && source ./emsdk_env.sh).
# Uso: bash scripts/robotstxt-wasm/build.sh  → src/lib/robotstxt/robotstxt.{mjs,wasm}
set -euo pipefail

ROBOTSTXT_COMMIT=22b355ff855419e6a3ff8ff09c0ad7fdb17116f9  # google/robotstxt, abril de 2026
ABSEIL_TAG=20250814.1

here="$(cd "$(dirname "$0")" && pwd)"
out="$here/../../src/lib/robotstxt"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

git clone -q https://github.com/google/robotstxt.git "$work/robotstxt"
git -C "$work/robotstxt" checkout -q "$ROBOTSTXT_COMMIT"
git clone -q --depth 1 --branch "$ABSEIL_TAG" https://github.com/abseil/abseil-cpp.git "$work/abseil"

absl="$work/abseil/absl"
em++ -O3 -std=c++17 -DNDEBUG \
  -I "$work/robotstxt" -I "$work/abseil" \
  "$here/robots_web.cc" \
  "$work/robotstxt/robots.cc" "$work/robotstxt/reporting_robots.cc" \
  "$absl/strings/ascii.cc" "$absl/strings/match.cc" "$absl/strings/internal/memutil.cc" \
  "$absl/base/internal/raw_logging.cc" \
  -lembind \
  -sMODULARIZE=1 -sEXPORT_ES6=1 -sEXPORT_NAME=createRobotsModule \
  -sENVIRONMENT=web -sFILESYSTEM=0 -sALLOW_MEMORY_GROWTH=1 \
  -sDYNAMIC_EXECUTION=0 -sINCOMING_MODULE_JS_API=instantiateWasm \
  -o "$out/robotstxt.mjs"

echo "OK: $out/robotstxt.mjs + robotstxt.wasm"
