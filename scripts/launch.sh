#!/usr/bin/env bash
# Starts the Study Hub server in the background (if it isn't already running) and opens the hub
# in the browser. Point an app-menu .desktop entry's Exec= at this script to launch it from the menu.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${STUDY_HUB_PORT:-8231}"
URL="http://127.0.0.1:${PORT}/"
LOG="${XDG_STATE_HOME:-$HOME/.local/state}/study-hub/server.log"

if ! curl -fs -o /dev/null "$URL"; then
  mkdir -p "$(dirname "$LOG")"
  nohup python3 "$ROOT/scripts/serve.py" "$PORT" >"$LOG" 2>&1 &
  for _ in $(seq 1 25); do
    curl -fs -o /dev/null "$URL" && break
    sleep 0.2
  done
fi

if ! curl -fs -o /dev/null "$URL"; then
  echo "Study Hub server failed to start; see $LOG" >&2
  exit 1
fi
xdg-open "$URL" >/dev/null 2>&1 &
