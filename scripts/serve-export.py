"""Local static-export server with the same clean-URL fallback as Nginx."""
import argparse
import functools
import http.server
from pathlib import Path
from urllib.parse import unquote, urlsplit

class ExportHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        clean = unquote(urlsplit(path).path).rstrip('/')
        normal = super().translate_path(clean or '/')
        html = Path(normal + '.html')
        if html.is_file(): return str(html)
        return super().translate_path(path)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--directory', default='out')
    parser.add_argument('--port', type=int, default=6102)
    args = parser.parse_args()
    with http.server.ThreadingHTTPServer(('127.0.0.1', args.port), functools.partial(ExportHandler, directory=args.directory)) as server:
        server.serve_forever()
