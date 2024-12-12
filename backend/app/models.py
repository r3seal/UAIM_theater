from . import db
import enum
from werkzeug.security import generate_password_hash, check_password_hash


# Model for spectacles
class Spectacle(db.Model):
    __tablename__ = 'spectacles'
    spectacle_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    date = db.Column(db.DateTime, nullable=False)
    duration = db.Column(db.Integer, nullable=False)

    # Relationships
    tickets = db.relationship('Ticket', backref='spectacle_ref', lazy=True)


# Model for the hall
class Hall(db.Model):
    __tablename__ = 'halls'
    hall_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)


# Model for seats
class Seat(db.Model):
    __tablename__ = 'seats'
    seat_id = db.Column(db.Integer, primary_key=True)
    hall_id = db.Column(db.Integer, db.ForeignKey('halls.hall_id'), nullable=False)
    row = db.Column(db.Integer, nullable=False)
    seat_number = db.Column(db.Integer, nullable=False)

    hall = db.relationship('Hall', backref='seats_ref')


# Model for tickets
class Ticket(db.Model):
    __tablename__ = 'tickets'
    ticket_id = db.Column(db.Integer, primary_key=True)
    seat_id = db.Column(db.Integer, db.ForeignKey('seats.seat_id'), nullable=False)
    spectacle_id = db.Column(db.Integer, db.ForeignKey('spectacles.spectacle_id'), nullable=False)
    price = db.Column(db.Numeric, nullable=False)

    # Relationship with seat
    seat = db.relationship('Seat', backref='ticket_ref', lazy=True)


# Model for sold tickets
class TicketSold(db.Model):
    __tablename__ = 'tickets_sold'
    ticket_sold_id = db.Column(db.Integer, primary_key=True)  # Added ID for this table
    ticket_id = db.Column(db.Integer, db.ForeignKey('tickets.ticket_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)

    # Relationships
    ticket = db.relationship('Ticket', backref=db.backref('ticket_sold', uselist=False))  # Ticket that was sold
    user = db.relationship('User', backref=db.backref('tickets_sold', lazy=True))  # User who bought the ticket


# Enum for user roles
class RoleEnum(enum.Enum):
    user = 'user'
    admin = 'admin'


# Model for users
class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.Enum(RoleEnum), nullable=False, default=RoleEnum.user)  # Using Enum for role

    def get_id(self):
        return self.user_id

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
