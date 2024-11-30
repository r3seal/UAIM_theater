from app import db
from app.models import User, RoleEnum, Spectacle, Hall, Seat, Ticket, Transaction, SeatStatus
from datetime import datetime, timedelta
from decimal import Decimal

# Ważne: wkleic kod po wykonaniu komendy: docker-compose exec backend flask shell
# Usuwanie istniejących danych i tworzenie nowych tabel
db.drop_all()
db.create_all()

# Dodaj użytkowników
user1 = User(name="John Doe", email="john@example.com", phone="123456789", role=RoleEnum.user)
user1.set_password("password123")

admin = User(name="Admin", email="admin@example.com", phone="987654321", role=RoleEnum.admin)
admin.set_password("adminpass")

db.session.add_all([user1, admin])

# Dodaj sale
hall1 = Hall(name="Main Hall", capacity=200)
hall2 = Hall(name="Small Hall", capacity=100)

db.session.add_all([hall1, hall2])
db.session.flush()  # Wymusza zapis, aby móc korzystać z ID

# Dodaj miejsca w salach
seats = []
for hall, capacity in [(hall1, 200), (hall2, 100)]:
    for row in range(1, 11):  # 10 rzędów
        for seat_num in range(1, capacity // 10 + 1):  # Dzielimy po równo miejsca na rzędy
            seats.append(Seat(hall_id=hall.hall_id, row=f"Row {row}", seat_number=seat_num, is_vip=(seat_num <= 5)))
db.session.add_all(seats)

# Dodaj spektakle
spectacle1 = Spectacle(
    title="Hamlet",
    description="A classic play by William Shakespeare.",
    date=datetime.now() + timedelta(days=5),
    duration=180
)
spectacle2 = Spectacle(
    title="Romeo and Juliet",
    description="Another classic by Shakespeare.",
    date=datetime.now() + timedelta(days=10),
    duration=150
)
db.session.add_all([spectacle1, spectacle2])
db.session.flush()

# Dodaj status miejsc dla spektakli
seat_statuses = []
for seat in seats[:20]:  # Pierwsze 20 miejsc
    seat_statuses.append(SeatStatus(spectacle_id=spectacle1.spectacle_id, seat_id=seat.seat_id, is_reserved=False, is_sold=False))
for seat in seats[20:40]:  # Następne 20 miejsc
    seat_statuses.append(SeatStatus(spectacle_id=spectacle2.spectacle_id, seat_id=seat.seat_id, is_reserved=True, is_sold=True))
db.session.add_all(seat_statuses)

# Dodaj bilety
ticket1 = Ticket(
    spectacle_id=spectacle1.spectacle_id,
    seat_id=seats[0].seat_id,
    user_id=user1.user_id,
    price=Decimal("50.00"),
    purchase_date=datetime.now(),
    status="Paid"
)
ticket2 = Ticket(
    spectacle_id=spectacle2.spectacle_id,
    seat_id=seats[20].seat_id,
    user_id=user1.user_id,
    price=Decimal("70.00"),
    purchase_date=datetime.now(),
    status="Paid"
)
db.session.add_all([ticket1, ticket2])

# Dodaj transakcje
transaction1 = Transaction(
    ticket_id=ticket1.ticket_id,
    amount=Decimal("50.00"),
    payment_method="Credit Card",
    status="Completed",
    transaction_date=datetime.now()
)
transaction2 = Transaction(
    ticket_id=ticket2.ticket_id,
    amount=Decimal("70.00"),
    payment_method="PayPal",
    status="Completed",
    transaction_date=datetime.now()
)
db.session.add_all([transaction1, transaction2])

# Zatwierdzenie zmian
db.session.commit()
print("Database populated with sample data!")
