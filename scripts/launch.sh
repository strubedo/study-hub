#!/usr/bin/env bash
# Starts the study site in the background (if it isn't already running) and opens it in the browser.
# Used by the "CCNA Prep" app-menu entry (~/.local/share/applications/ccna-prep.desktop).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${CCNA_PREP_PORT:-8231}"
URL="http://127.0.0.1:${PORT}/"
LOG="${XDG_STATE_HOME:-$HOME/.local/state}/ccna-prep/server.log"

if ! curl -fs -o /dev/null "$URL"; then
  mkdir -p "$(dirname "$LOG")"
  nohup python3 "$ROOT/scripts/serve.py" "$PORT" >"$LOG" 2>&1 &
  for _ in $(seq 1 25); do
    curl -fs -o /dev/null "$URL" && break
    sleep 0.2
  done
fi

if ! curl -fs -o /dev/null "$URL"; then
  echo "CCNA Prep server failed to start; see $LOG" >&2
  exit 1
fi
xdg-open "$URL" >/dev/null 2>&1 &
