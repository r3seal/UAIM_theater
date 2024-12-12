from flask import Blueprint, jsonify, request
from .models import Spectacle, Ticket, Seat, Hall, User, TicketSold
from sqlalchemy import func
import logging
from . import db
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

logging.basicConfig(level=logging.DEBUG)

# Creating the admin blueprint
admin_blueprint = Blueprint('admin', __name__)

# Endpoint to get all users (accessible only to admin)
@admin_blueprint.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    current_user_id = get_jwt_identity()
    jwt_data = get_jwt()
    current_user_role = jwt_data.get('role')
    logging.debug(f"Current user ID: {current_user_id}, Role: {current_user_role}")
    
    # Only allow access if the user has admin role
    if current_user_role == 'admin':
        users = User.query.all()
        return jsonify([
            {
                "user_id": user.user_id,
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "role": user.role.value 
            }
            for user in users
        ])
    return jsonify({'message': 'Not allowed'}), 401


# Endpoint to add a spectacle (accessible only to admin)
@admin_blueprint.route('/add_spectacle', methods=['POST'])
@jwt_required()
def add_spectacle():
    # Check if the current user is an admin
    current_user_id = get_jwt_identity()
    jwt_data = get_jwt()
    current_user_role = jwt_data.get('role')
    logging.debug(f"Current user ID: {current_user_id}, Role: {current_user_role}")
    
    # If the user is not an admin, return an error
    if current_user_role != 'admin':
        return jsonify({"message": "Access forbidden: Admins only."}), 403

    data = request.get_json()

    # Check if all required fields are provided
    required_fields = ['title', 'description', 'date', 'duration', 'ticket_price_1_to_5', 'ticket_price_above_5', 'hall_name']
    for field in required_fields:
        if field not in data:
            return jsonify({"message": f"Missing field: {field}"}), 400

    # Adding the spectacle to the database
    logging.debug("After data verification")
    try:
        spectacle = Spectacle(
            title=data['title'],
            description=data['description'],
            date=data['date'],
            duration=data['duration']
        )
        db.session.add(spectacle)
        db.session.flush()
        logging.debug("Spectacle successfully added")

        # Add tickets for the hall
        hall = Hall.query.filter_by(name='Main Hall').first()
        if not hall:
            return jsonify({"message": "No hall found in the database."}), 404
        
        logging.debug(f"Hall selected {hall.name}")
        
        # Add tickets for the first 5 rows
        for row_num in range(1, 6):  # First 5 rows
            for seat_num in range(1, hall.capacity // 5 + 1):  # Number of seats per row
                seat = Seat.query.filter_by(hall_id=hall.hall_id, row=row_num, seat_number=seat_num).first()
                if seat:
                    ticket = Ticket(
                        seat_id=seat.seat_id,
                        spectacle_id=spectacle.spectacle_id,
                        price=data['ticket_price_1_to_5']
                    )
                    db.session.add(ticket)

        # Add tickets for rows above 5
        for row_num in range(6, hall.capacity // 5 + 1):  # Rows above 5
            for seat_num in range(1, hall.capacity // 5 + 1):
                seat = Seat.query.filter_by(hall_id=hall.hall_id, row=row_num, seat_number=seat_num).first()
                if seat:
                    ticket = Ticket(
                        seat_id=seat.seat_id,
                        spectacle_id=spectacle.spectacle_id,
                        price=data['ticket_price_above_5']
                    )
                    db.session.add(ticket)

        db.session.commit()

        return jsonify({"message": "Spectacle and tickets added successfully."}), 201

    except Exception as e:
        db.session.rollback()
        logging.error(f"Error adding spectacle: {str(e)}")
        return jsonify({"message": "Error adding spectacle."}), 500


# Endpoint to generate a report based on a date range (accessible only to admin)
@admin_blueprint.route('/report', methods=['GET'])
@jwt_required()
def generate_report():
    current_user_id = get_jwt_identity()
    jwt_data = get_jwt()
    current_user_role = jwt_data.get('role')
    logging.debug(f"Current user ID: {current_user_id}, Role: {current_user_role}")
    
    # Only allow access if the user is an admin
    if current_user_role != 'admin':
        return jsonify({"message": "Access forbidden: Admins only."}), 403
    
    # Retrieve date range (start_date, end_date) from the request body
    data = request.get_json()
    start_date = data.get('start_date')
    end_date = data.get('end_date')

    if not start_date or not end_date:
        return jsonify({"error": "Start date and end date are required"}), 400

    # Report: number of tickets sold per spectacle
    sold_tickets = db.session.query(
        Spectacle.title,
        func.count(TicketSold.ticket_id).label('tickets_sold'),
        func.sum(Ticket.price).label('total_revenue')
    ).join(Ticket, Ticket.ticket_id == TicketSold.ticket_id) \
     .join(Spectacle, Spectacle.spectacle_id == Ticket.spectacle_id) \
     .filter(Spectacle.date >= start_date, Spectacle.date <= end_date) \
     .group_by(Spectacle.title).all()

    # Report: most popular seats (top 3)
    most_popular_seats = db.session.query(
        Seat.row,
        Seat.seat_number,
        func.count(TicketSold.ticket_id).label('times_selected')
    ).join(Ticket, Ticket.ticket_id == TicketSold.ticket_id) \
     .join(Seat, Seat.seat_id == Ticket.seat_id) \
     .group_by(Seat.row, Seat.seat_number) \
     .order_by(func.count(TicketSold.ticket_id).desc()) \
     .limit(3).all()

    # Report: least popular seats (bottom 3)
    least_popular_seats = db.session.query(
        Seat.row,
        Seat.seat_number,
        func.count(TicketSold.ticket_id).label('times_selected')
    ).join(Ticket, Ticket.ticket_id == TicketSold.ticket_id) \
     .join(Seat, Seat.seat_id == Ticket.seat_id) \
     .group_by(Seat.row, Seat.seat_number) \
     .order_by(func.count(TicketSold.ticket_id).asc()) \
     .limit(3).all()

    # Preparing the report results
    report = {
        "sold_tickets_per_spectacle": [
            {
                "spectacle_title": row.title,
                "tickets_sold": row.tickets_sold,
                "total_revenue": float(row.total_revenue) if row.total_revenue else 0.0
            } for row in sold_tickets
        ],
        "most_popular_seats": [
            {
                "row": row.row,
                "seat_number": row.seat_number,
                "times_selected": row.times_selected
            } for row in most_popular_seats
        ],
        "least_popular_seats": [
            {
                "row": row.row,
                "seat_number": row.seat_number,
                "times_selected": row.times_selected
            } for row in least_popular_seats
        ]
    }

    return jsonify(report), 200
