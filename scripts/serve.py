#!/usr/bin/env python3
"""Static file server for the Study Hub (hub + every course), bound to localhost.

Same as `python3 -m http.server`, but sends `Cache-Control: no-cache` so the
browser revalidates ES modules and lesson files on every load. Without it,
browsers can keep running stale code after the site is updated.
"""
import argparse
import functools
import http.server
from pathlib import Path


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("port", nargs="?", type=int, default=8231)
    parser.add_argument("--bind", default="127.0.0.1")
    args = parser.parse_args()
    root = Path(__file__).resolve().parent.parent
    handler = functools.partial(NoCacheHandler, directory=str(root))
    with http.server.ThreadingHTTPServer((args.bind, args.port), handler) as httpd:
        print(f"Study Hub → http://{args.bind}:{args.port}/   (Ctrl+C to stop)", flush=True)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
