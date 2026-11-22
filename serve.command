#!/usr/bin/env bash
# Study Hub for macOS: double-click in Finder to start the server and open the hub.
cd "$(dirname "$0")" || exit 1
# macOS ships a python3 stub that only works once Apple's Command Line Tools are installed.
if ! python3 -c 'import http.server' >/dev/null 2>&1; then
  echo "Study Hub needs Python 3, which is not set up on this Mac yet."
  echo
  echo "Install it one of these ways, then double-click serve.command again:"
  echo "  - Run:  xcode-select --install     (Apple's Command Line Tools, includes Python 3)"
  echo "  - Or download Python from https://www.python.org/downloads/"
  echo
  read -r -p "Press Return to close this window. "
  exit 1
fi
exec python3 scripts/serve.py --open "$@"
