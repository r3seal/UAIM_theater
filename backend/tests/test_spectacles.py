import pytest
from flask_jwt_extended import create_access_token
from app import db
from app.models import Spectacle, Ticket, TicketSold, User, Hall, Seat
from werkzeug.security import generate_password_hash

import datetime

def test_get_spectacles(client):
    # Tworzenie obiektu typu datetime.date zamiast ciągu znaków
    spectacle = Spectacle(
        title="Spectacle 1", 
        description="Description", 
        date=datetime.date(2025, 1, 2),  # Używamy datetime.date zamiast ciągu znaków
        duration="02:00:00"
    )
    db.session.add(spectacle)
    db.session.commit()

    # Wykonaj żądanie GET
    response = client.get('/spectacles/')
    print(response.status_code)  # Sprawdź kod odpowiedzi
    print(response.headers) 

    # Sprawdź, czy odpowiedź zawiera spektakl
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) > 0
    assert data[0]['title'] == "Spectacle 1"



# Test dla pobierania danych o dostępnych miejscach
def test_get_seat_data(client):
    # Dodaj spektakl
    spectacle = Spectacle(title="Spectacle 1", description="Description", date=datetime.date(2025, 1, 2), duration="02:00:00")
    db.session.add(spectacle)
    db.session.commit()

    # Dodaj salę (hall) i miejsce (seat)
    hall = Hall(name="Main Hall", capacity=100)
    db.session.add(hall)
    db.session.commit()

    seat = Seat(row=1, seat_number=1, hall_id=hall.hall_id)
    db.session.add(seat)
    db.session.commit()

    # Dodaj bilet powiązany z miejscem
    ticket = Ticket(spectacle_id=spectacle.spectacle_id, seat_id=seat.seat_id, price=100)
    db.session.add(ticket)
    db.session.commit()

    # Teraz wykonaj żądanie GET
    response = client.get(f'/spectacles/{spectacle.spectacle_id}/seats')
    
    assert response.status_code == 200
    data = response.get_json()
    assert data['spectacle']['title'] == "Spectacle 1"
    assert len(data['seats']) > 0
    assert data['seats'][0]['available'] is True



