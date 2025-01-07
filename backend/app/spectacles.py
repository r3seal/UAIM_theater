from flask import Blueprint, jsonify, request
from .models import User
from . import db
from .models import Ticket, Spectacle, Hall, Seat, TicketSold
import logging
from .utils import send_ticket_email
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
import logging
import os


logging.basicConfig(level=logging.DEBUG)

spectacles_blueprint = Blueprint('spectacles', __name__)


# returns all available dates of spectacles
@spectacles_blueprint.route('/', methods=['GET'])
def get_spectacles():
    spectacles = Spectacle.query.all()
    return jsonify([
        {
            "spectacle_id": spectacle.spectacle_id,
            "title": spectacle.title,
            "description": spectacle.description,
            "date": spectacle.date,
            "duration": spectacle.duration
        }
        for spectacle in spectacles
    ])



# returns info about spectacle, hall, and seats (available and not)
# there will be button 'buy' which redirects to '/buy' in frontend
@spectacles_blueprint.route('/<int:spectacle_id>/seats', methods=['GET'])
def get_seat_data(spectacle_id):
    spectacle = Spectacle.query.filter_by(spectacle_id=spectacle_id).first()
    if not spectacle:
        return jsonify({"error": "Spectacle not found"}), 404
    
    
    tickets = Ticket.query.filter_by(spectacle_id = spectacle_id).all()
    if not tickets:
        return jsonify({"error": "No tickets found for this spectacle"}), 404
    

    available = []
    for ticket in tickets:
        ticket_sold = TicketSold.query.filter_by(ticket_id=ticket.ticket_id).first()
        if not ticket_sold:
            available.append(True)
        else:
            available.append(False)
    

    

    hall = Hall.query.get(tickets[0].seat.hall_id)
    

    seat_data = [
        {
            "seat_id": tickets[i].seat.seat_id,
            "row": tickets[i].seat.row,
            "seat_number": tickets[i].seat.seat_number,
            "available": available[i]
        } for i in range(len(tickets))
    ]

    return jsonify({
        "spectacle": {
            "spectacle_id": spectacle.spectacle_id,
            "title": spectacle.title,
            "description": spectacle.description,
            "date": spectacle.date.isoformat(),
            "duration": spectacle.duration
        },
        "hall": {
            "hall_id": hall.hall_id,
            "name": hall.name,
            "capacity": hall.capacity
        },
        "seats": seat_data
    }), 200



# requests for spectacle_id and seat_ids (list)
@spectacles_blueprint.route('/buy', methods=['POST'])
@jwt_required()
def reserve_seat():
    user_id = get_jwt_identity()
    data = request.get_json()
    seat_ids = data.get('seat_ids')
    spectacle_id = data.get('spectacle_id')

    tickets_bought = []

   
    for seat_id in seat_ids:
        ticket = Ticket.query.filter_by(seat_id=seat_id, spectacle_id=spectacle_id).first()
        if not ticket:
            return jsonify({"error": "No ticket for this seat"}), 404
        
        ticket_sold = TicketSold.query.filter_by(ticket_id=ticket.ticket_id).first()
        if ticket_sold:
            return jsonify({"error": "Ticket not available"}), 404 
        
        new_ticket_sold = TicketSold(ticket_id=ticket.ticket_id, user_id=user_id)
        db.session.add(new_ticket_sold)

         # Prepare ticket details for email
        tickets_bought.append({
            "spectacle_title": ticket.spectacle_ref.title,
            "date": ticket.spectacle_ref.date.isoformat(),
            "hall": ticket.seat.hall.name,
            "row": ticket.seat.row,
            "seat_number": ticket.seat.seat_number,
            "price": ticket.price
        })
    db.session.commit()

     # Get user email
    user = User.query.get(user_id)
    if user and user.email:
        send_ticket_email(user, tickets_bought)
        os.remove('ticket_confirmation.pdf')

    return jsonify({"message": "Ticket successfully bought"}), 200
        
        

