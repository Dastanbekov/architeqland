from ninja import Router
from ninja.errors import HttpError
from django.contrib.auth import authenticate
from ninja_jwt.tokens import RefreshToken
from pydantic import BaseModel
from django.conf import settings
from datetime import datetime

router = Router(tags=["Auth"])

class LoginSchema(BaseModel):
    username: str
    password: str

class TokenSchema(BaseModel):
    access: str

from django.http import HttpResponse

@router.post("/login", response=TokenSchema)
def login(request, payload: LoginSchema, response: HttpResponse):
    user = authenticate(username=payload.username, password=payload.password)
    if user is None:
        raise HttpError(401, "Invalid credentials")
    
    refresh = RefreshToken.for_user(user)
    
    # Set the refresh token in an HttpOnly cookie
    max_age = int(settings.NINJA_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())
    expires = datetime.utcnow() + settings.NINJA_JWT['REFRESH_TOKEN_LIFETIME']
    
    response.set_cookie(
        settings.NINJA_JWT['AUTH_COOKIE_NAME'],
        str(refresh),
        max_age=max_age,
        expires=expires.strftime("%a, %d-%b-%Y %H:%M:%S GMT"),
        httponly=True,
        samesite='Lax',
        secure=not settings.DEBUG,  # True in production
        path='/api/apps/auth/refresh'
    )
    return {"access": str(refresh.access_token)}

@router.post("/refresh", response=TokenSchema)
def refresh_token(request):
    cookie_name = settings.NINJA_JWT['AUTH_COOKIE_NAME']
    refresh_token_str = request.COOKIES.get(cookie_name)
    
    if not refresh_token_str:
        raise HttpError(401, "No refresh token provided")
        
    try:
        refresh = RefreshToken(refresh_token_str)
        return {"access": str(refresh.access_token)}
    except Exception:
        raise HttpError(401, "Invalid refresh token")

@router.post("/logout")
def logout(request, response: HttpResponse):
    response.delete_cookie(settings.NINJA_JWT['AUTH_COOKIE_NAME'], path='/api/apps/auth/refresh')
    return {"message": "Logged out successfully"}
