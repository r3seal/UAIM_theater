
import sys
import os

# Dodaj katalog główny do ścieżki
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import pytest
from app import create_app, db
from app.models import User

@pytest.fixture
def app():
    """Tworzenie aplikacji Flask w trybie testowym."""
    app = create_app(testing=True)
    with app.app_context():
        db.create_all()  # Tworzenie tabel w bazie SQLite (in-memory)
        yield app
        db.session.remove()
        db.drop_all()  # Usuwanie tabel po testach

@pytest.fixture
def client(app):
    """Tworzenie klienta testowego."""
    return app.test_client()

@pytest.fixture
def runner(app):
    """Tworzenie runnera CLI."""
    return app.test_cli_runner()
