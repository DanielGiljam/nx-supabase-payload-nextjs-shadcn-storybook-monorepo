#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

pnpm nx affected --targets=typecheck,lint # maximize parallelization opportunity
pnpm prettier $*
