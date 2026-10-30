#!/usr/bin/env python3
"""Static file server for the Study Hub (hub + every course), bound to localhost.

Same as `python3 -m http.server`, but sends `Cache-Control: no-cache` so the
browser revalidates ES modules and lesson files on every load. Without it,
browsers can keep running stale code after the site is updated. MIME types are
pinned because Windows Python reads them from the registry, which can map .js to
text/plain and stop ES modules from loading.
"""
import argparse
import functools
import http.server
import threading
import webbrowser
from pathlib import Path

MIME_TYPES = {
    ".js": "text/javascript",
    ".mjs": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".md": "text/markdown; charset=utf-8",
    ".svg": "image/svg+xml",
    ".html": "text/html; charset=utf-8",
}


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, **MIME_TYPES}

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("port", nargs="?", type=int, default=8231)
    parser.add_argument("--bind", default="127.0.0.1")
    parser.add_argument("--open", action="store_true", help="open the hub in the default browser")
    args = parser.parse_args()
    root = Path(__file__).resolve().parent.parent
    handler = functools.partial(NoCacheHandler, directory=str(root))
    with http.server.ThreadingHTTPServer((args.bind, args.port), handler) as httpd:
        url = f"http://{args.bind}:{args.port}/"
        print(f"Study Hub → {url}   (Ctrl+C or close this window to stop)", flush=True)
        if args.open:
            threading.Timer(0.5, webbrowser.open, args=(url,)).start()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
