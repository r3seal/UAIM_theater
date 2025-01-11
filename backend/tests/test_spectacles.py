import pytest
from flask_jwt_extended import create_access_token
from app import db
from app.models import Spectacle, Ticket, TicketSold, User, Hall, Seat
from werkzeug.security import generate_password_hash

import datetime


# Get spectacles test
def test_get_spectacles(client):
    spectacle = Spectacle(
        title="Spectacle 1", 
        description="Description", 
        date=datetime.date(2025, 1, 2),  
        duration="02:00:00"
    )
    db.session.add(spectacle)
    db.session.commit()

    response = client.get('/spectacles/')
    print(response.status_code)
    print(response.headers) 

    assert response.status_code == 200
    data = response.get_json()
    assert len(data) > 0
    assert data[0]['title'] == "Spectacle 1"



# Getting seats data test
def test_get_seat_data(client):

    spectacle = Spectacle(title="Spectacle 1", description="Description", date=datetime.date(2025, 1, 2), duration="02:00:00")
    db.session.add(spectacle)
    db.session.commit()

    hall = Hall(name="Main Hall", capacity=100)
    db.session.add(hall)
    db.session.commit()

    seat = Seat(row=1, seat_number=1, hall_id=hall.hall_id)
    db.session.add(seat)
    db.session.commit()

    ticket = Ticket(spectacle_id=spectacle.spectacle_id, seat_id=seat.seat_id, price=100)
    db.session.add(ticket)
    db.session.commit()

    response = client.get(f'/spectacles/{spectacle.spectacle_id}/seats')
    
    assert response.status_code == 200
    data = response.get_json()
    assert data['spectacle']['title'] == "Spectacle 1"
    assert len(data['seats']) > 0
    assert data['seats'][0]['available'] is True


def test_reserve_seat_no_ticket(client, user, spectacle_and_ticket):
    spectacle, _, _ = spectacle_and_ticket
    
    # Log in to get access_token
    login_data = {
        "email": "john.doe@gmail.com",
        "password": "hashed_password"
    }

    # login request
    login_response = client.post('/auth/login', json=login_data)
    print(login_response.json)

    # Checking for login completion
    assert login_response.status_code == 200
    access_token = login_response.json.get('access_token')

    # Non-existent seat id
    payload = {
        "seat_ids": [9999],  
        "spectacle_id": spectacle.spectacle_id
    }

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    response = client.post('/spectacles/buy', json=payload, headers=headers)


    assert response.status_code == 404
    assert response.json.get('error') == "No ticket for this seat"





