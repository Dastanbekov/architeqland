import os

# MUST be set before any Django imports
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

from django.core.asgi import get_asgi_application

# Initialize Django app registry before importing anything that uses models
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from generation.middleware import JWTAuthMiddlewareStack
import generation.routing

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JWTAuthMiddlewareStack(
        URLRouter(
            generation.routing.websocket_urlpatterns
        )
    ),
})
