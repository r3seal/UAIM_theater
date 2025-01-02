import os
import secrets


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://postgres:password@db:5432/mydatabase')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = secrets.token_hex(16)
    JWT_SECRET_KEY = secrets.token_hex(16)
    JWT_TOKEN_LOCATION = ['cookies']
    JWT_ACCESS_COOKIE_NAME = 'access_token_cookie'
    JWT_REFRESH_COOKIE_NAME = 'refresh_token_cookie'
    JWT_COOKIE_CSRF_PROTECT = False


class TestingConfig(Config):
    TESTING = True
    SECRET_KEY = secrets.token_hex(16)
    JWT_SECRET_KEY = secrets.token_hex(16)
    JWT_TOKEN_LOCATION = ['cookies']
    JWT_ACCESS_COOKIE_NAME = 'access_token_cookie'
    JWT_REFRESH_COOKIE_NAME = 'refresh_token_cookie'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # Szybka baza in-memory dla testów
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_COOKIE_CSRF_PROTECT = False
    WTF_CSRF_ENABLED = False
    