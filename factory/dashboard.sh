#!/usr/bin/env bash
# Serve the factory dashboard at http://localhost:8000/dashboard.html
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
mkdir -p jobs
PORT="${1:-8000}"
echo "Factory dashboard: http://localhost:$PORT/dashboard.html (Ctrl+C to stop)"
( sleep 1; command -v open >/dev/null && open "http://localhost:$PORT/dashboard.html" ) &
exec python3 -m http.server "$PORT" --bind 127.0.0.1
