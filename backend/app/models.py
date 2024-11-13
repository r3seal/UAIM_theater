from . import db

# Model dla spektakli
class Spectacle(db.Model):
    __tablename__ = 'spectacles'
    spectacle_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    date = db.Column(db.DateTime, nullable=False)
    duration = db.Column(db.Integer, nullable=False)

    # Relacje
    tickets = db.relationship('Ticket', backref='spectacle', lazy=True)
    seat_statuses = db.relationship('SeatStatus', backref='spectacle', lazy=True)

# Model dla sali
class Hall(db.Model):
    __tablename__ = 'halls'
    hall_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)

    # Relacja z miejscami
    seats = db.relationship('Seat', backref='hall', lazy=True)

# Model dla miejsca
class Seat(db.Model):
    __tablename__ = 'seats'
    seat_id = db.Column(db.Integer, primary_key=True)
    hall_id = db.Column(db.Integer, db.ForeignKey('halls.hall_id'), nullable=False)
    row = db.Column(db.String(10), nullable=False)
    seat_number = db.Column(db.Integer, nullable=False)
    is_vip = db.Column(db.Boolean, default=False)

# Model dla użytkownika
class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=True)

    # Relacja z biletami
    tickets = db.relationship('Ticket', backref='user', lazy=True)

# Model dla biletu
class Ticket(db.Model):
    __tablename__ = 'tickets'
    ticket_id = db.Column(db.Integer, primary_key=True)
    spectacle_id = db.Column(db.Integer, db.ForeignKey('spectacles.spectacle_id'), nullable=False)
    seat_id = db.Column(db.Integer, db.ForeignKey('seats.seat_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    price = db.Column(db.Numeric, nullable=False)
    purchase_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), nullable=False)

# Model dla transakcji
class Transaction(db.Model):
    __tablename__ = 'transactions'
    transaction_id = db.Column(db.Integer, primary_key=True)
    ticket_id = db.Column(db.Integer, db.ForeignKey('tickets.ticket_id'), nullable=False)
    amount = db.Column(db.Numeric, nullable=False)
    payment_method = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    transaction_date = db.Column(db.DateTime, nullable=False)

# Model dla statusu miejsc
class SeatStatus(db.Model):
    __tablename__ = 'seat_statuses'
    seat_status_id = db.Column(db.Integer, primary_key=True)
    spectacle_id = db.Column(db.Integer, db.ForeignKey('spectacles.spectacle_id'), nullable=False)
    seat_id = db.Column(db.Integer, db.ForeignKey('seats.seat_id'), nullable=False)
    is_reserved = db.Column(db.Boolean, default=False)
    is_sold = db.Column(db.Boolean, default=False)
