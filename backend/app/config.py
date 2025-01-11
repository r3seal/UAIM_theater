import os
import secrets


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://postgres:password@db:5432/mydatabase')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = secrets.token_hex(16)
    JWT_SECRET_KEY = secrets.token_hex(16)
    JWT_TOKEN_LOCATION = ['headers']
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # Expiry time of access token (seconds)
    JWT_REFRESH_TOKEN_EXPIRES = 2592000  # Expiry time of refresh tokenb (30 days)


class TestingConfig(Config):
    TESTING = True
    SECRET_KEY = secrets.token_hex(16)
    JWT_SECRET_KEY = secrets.token_hex(16)
    JWT_TOKEN_LOCATION = ['headers']
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # in-memory base for tests
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_ENABLED = False
