#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

if [[ -n "$CONVENIENCE_SCRIPTS_ALL" ]]; then
    pnpm fix:all $*
    pnpm format:all $*
else
    pnpm fix $*
    pnpm format $*
fi
