#!/usr/bin/env bash
# Study Hub for macOS: double-click in Finder to start the server and open the hub.
cd "$(dirname "$0")"
exec python3 scripts/serve.py --open "$@"
