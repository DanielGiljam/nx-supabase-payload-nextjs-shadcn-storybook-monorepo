#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

if [[ -n "$CONVENIENCE_SCRIPTS_ALL" ]]; then
    pnpm lint:all $*
    pnpm prettier:all $*
else
    pnpm lint $*
    pnpm prettier $*
fi
