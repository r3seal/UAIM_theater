from datetime import datetime
from app import db
from app.models import Spectacle, Hall, Seat, User, Ticket, Transaction, SeatStatus

# Dodaj przykładowe spektakle
spectacle1 = Spectacle(title="Hamlet", description="Tragiczna opowieść o duńskim księciu", date=datetime(2023, 12, 20, 18, 0), duration=120)
spectacle2 = Spectacle(title="Król Lear", description="Historia szaleństwa i zdrady", date=datetime(2024, 1, 15, 19, 30), duration=150)

db.session.add(spectacle1)
db.session.add(spectacle2)

# Dodaj przykładowe sale
hall1 = Hall(name="Sala Główna", capacity=100)
hall2 = Hall(name="Sala Kameralna", capacity=50)

db.session.add(hall1)
db.session.add(hall2)

# Dodaj przykładowe miejsca
seat1 = Seat(hall_id=3, row="A", seat_number=1, is_vip=True)
seat2 = Seat(hall_id=4, row="A", seat_number=2, is_vip=False)
seat3 = Seat(hall_id=4, row="B", seat_number=5, is_vip=False)

db.session.add_all([seat1, seat2, seat3])

# Dodaj przykładowych użytkowników
user1 = User(name="Anna Kowalska", email="anna@example.com", phone="123456789")
user2 = User(name="Jan Nowak", email="jan@example.com", phone="987654321")

db.session.add(user1)
db.session.add(user2)

# Dodaj przykładowe bilety
ticket1 = Ticket(spectacle_id=3, seat_id=1, user_id=1, price=50.0, purchase_date=datetime(2023, 11, 10, 15, 0), status="paid")
ticket2 = Ticket(spectacle_id=4, seat_id=2, user_id=2, price=30.0, purchase_date=datetime(2023, 12, 1, 10, 0), status="reserved")

db.session.add_all([ticket1, ticket2])

# Dodaj przykładowe transakcje
transaction1 = Transaction(ticket_id=3, amount=50.0, payment_method="card", status="completed", transaction_date=datetime(2023, 11, 10, 15, 5))
transaction2 = Transaction(ticket_id=4, amount=30.0, payment_method="paypal", status="pending", transaction_date=datetime(2023, 12, 1, 10, 10))

db.session.add_all([transaction1, transaction2])

# Dodaj przykładowe statusy miejsc
seat_status1 = SeatStatus(spectacle_id=3, seat_id=1, is_reserved=True, is_sold=True)
seat_status2 = SeatStatus(spectacle_id=4, seat_id=2, is_reserved=True, is_sold=False)
seat_status3 = SeatStatus(spectacle_id=3, seat_id=3, is_reserved=False, is_sold=False)

db.session.add_all([seat_status1, seat_status2, seat_status3])

# Zapisz zmiany do bazy danych
db.session.commit()
print("Dane przykładowe zostały dodane do bazy danych.")
