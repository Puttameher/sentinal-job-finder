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
    from backend.app.main import app
except ImportError:
    from app.main import app

# Expose app for Vercel ASGI serverless handler
app = app
