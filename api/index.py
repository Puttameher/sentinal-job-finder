import sys
import os

# Add root, backend, and app directories to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, ".."))
backend_dir = os.path.join(root_dir, "backend")

for p in [backend_dir, os.path.join(backend_dir, "app"), root_dir, current_dir]:
    if p not in sys.path and os.path.exists(p):
        sys.path.insert(0, p)

try:
    from backend.app.main import app as fastapi_app
except ImportError:
    from app.main import app as fastapi_app


class VercelPathMiddleware:
    """
    ASGI middleware ensuring that Vercel serverless function rewrites,
    x-forwarded-uri headers, and subpath invocations are mapped precisely
    to FastAPI routes regardless of Vercel runtime stripping.
    """
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            path = scope.get("path", "")
            # Check if Vercel provided the original rewritten URI header
            for header_name, header_val in scope.get("headers", []):
                if header_name.lower() in (b"x-forwarded-uri", b"x-matched-path", b"x-vercel-matched-path"):
                    uri = header_val.decode("latin1").split("?")[0]
                    if uri:
                        scope["path"] = uri
                        break

            # Handle direct /api/index.py or /index.py prefixes
            if path.startswith("/api/index.py"):
                sub = path[len("/api/index.py"):]
                scope["path"] = sub if sub.startswith("/") else ("/" + sub if sub else "/api")
            elif path.startswith("/index.py"):
                sub = path[len("/index.py"):]
                scope["path"] = sub if sub.startswith("/") else ("/" + sub if sub else "/api")

        await self.app(scope, receive, send)


app = VercelPathMiddleware(fastapi_app)
