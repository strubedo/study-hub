#!/usr/bin/env bash
# Serves the study site on localhost only. Usage: ./serve.sh [port]
set -euo pipefail
cd "$(dirname "$0")"
exec python3 scripts/serve.py "${1:-8231}"
