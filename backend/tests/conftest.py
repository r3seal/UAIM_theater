
import sys
import os
import datetime
# Dodaj katalog główny do ścieżki
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import pytest
from app import create_app, db
from app.models import User, Spectacle, Seat, Ticket, Hall

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


@pytest.fixture
def user():
    user = User(name="John Doe", email="john.doe@example.com", password_hash="hashed_password")
    db.session.add(user)
    db.session.commit()
    return user

@pytest.fixture
def spectacle_and_ticket(user):
    # Create spectacle
    spectacle = Spectacle(
        title="Spectacle 1",
        description="Description",
        date=datetime.date(2025, 1, 2),  # Specific date and time
        duration=120  # 2 hours in minutes
    )
    db.session.add(spectacle)
    db.session.commit()

    # Create hall and seat for the ticket
    hall = Hall(name="Main Hall", capacity=200)
    db.session.add(hall)
    db.session.commit()

    seat = Seat(hall_id=hall.hall_id, row=1, seat_number=1)
    db.session.add(seat)
    db.session.commit()

    # Create ticket for the spectacle and seat
    ticket = Ticket(spectacle_id=spectacle.spectacle_id, seat_id=seat.seat_id, price=100.0)
    db.session.add(ticket)
    db.session.commit()

    return spectacle, ticket, seat