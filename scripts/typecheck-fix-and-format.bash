#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

pnpm typecheck $*
pnpm fix $*
pnpm format $*
