#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

if [[ -n "$CONVENIENCE_SCRIPTS_ALL" ]]; then
    pnpm nx run-many --targets=typecheck,lint # maximize parallelization opportunity
    pnpm prettier:all $*
else
    pnpm nx affected --targets=typecheck,lint # maximize parallelization opportunity
    pnpm prettier $*
fi
