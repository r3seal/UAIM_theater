from app import create_app, db 
from app.models import Hall, Seat, Spectacle, User, RoleEnum, Ticket, TicketSold
from datetime import datetime, timedelta



app = create_app()


with app.app_context():


    admin = User(name="Admin User", email="admin@example.com", phone="123456789", role=RoleEnum.admin)

    admin.set_password("admin")

    db.session.add(admin)

    db.session.commit()


    users_data = [
        {"name": "John Doe", "email": "johndoe@gmail.com", "password": "password123", "phone": "123456789"},
        {"name": "Alice Smith", "email": "alicesmith@gmail.com", "password": "mypassword456", "phone": "987654321"},
        {"name": "Michael Johnson", "email": "michaeljohnson@yahoo.com", "password": "securepass789", "phone": "456789123"},
        {"name": "Sophia Brown", "email": "sophiabrown@hotmail.com", "password": "brownpass321", "phone": "789123456"},
        {"name": "Emma Davis", "email": "emmadavis@mail.com", "password": "davisemma111", "phone": "147258369"},
        {"name": "William Garcia", "email": "williamgarcia@outlook.com", "password": "garciapass222", "phone": "963852741"},
        {"name": "Olivia Rodriguez", "email": "oliviarodriguez@gmail.com", "password": "rodriguezpass333", "phone": "159753486"},
        {"name": "David Miller", "email": "davidmiller@yahoo.com", "password": "millerpass444", "phone": "258369147"},
        {"name": "Isabella Martinez", "email": "isabellamartinez@hotmail.com", "password": "martinezpass555", "phone": "741852963"},
        {"name": "Robert Wilson", "email": "robertwilson@mail.com", "password": "wilsonpass666", "phone": "369147258"},
        {"name": "Emily Moore", "email": "emilymoore@outlook.com", "password": "moorepass777", "phone": "753159486"},
        {"name": "Liam Taylor", "email": "liamtaylor@gmail.com", "password": "taylorpass888", "phone": "852963741"},
        {"name": "Charlotte Anderson", "email": "charlotteanderson@yahoo.com", "password": "andersonpass999", "phone": "963741852"},
        {"name": "Ethan Thomas", "email": "ethanthomas@hotmail.com", "password": "thomaspass000", "phone": "147369258"},
        {"name": "Amelia Walker", "email": "ameliawalker@mail.com", "password": "walkerpass112", "phone": "258147369"}
    ]

    users = []

    for user_data in users_data:
        # Create a User instance
        user = User(name=user_data["name"], email=user_data["email"], phone=user_data["phone"], role=RoleEnum.user)

        users.append(user)
        
        # Set the user's password (hashing it using set_password method)
        user.set_password(user_data["password"])

        # Add the user to the session
        db.session.add(user)

    db.session.commit()

    # Create and add 10 halls
    halls = [
        Hall(name="Main Hall", capacity=200),
        Hall(name="Side Hall", capacity=200),
        Hall(name="Royal Hall", capacity=200),
        Hall(name="Arena Hall", capacity=200),
        Hall(name="Opera House", capacity=200),
        Hall(name="Grand Theatre", capacity=200),
        Hall(name="City Centre Hall", capacity=200),
        Hall(name="Concert Hall", capacity=200),
        Hall(name="Studio Hall", capacity=200),
        Hall(name="VIP Hall", capacity=200)
    ]
    
    for hall in halls:
        db.session.add(hall)

    db.session.commit()

    # Create and add 10 spectacles
    spectacles = [
        Spectacle(title="The Phantom of the Opera", description="A timeless musical about love, mystery, and obsession.", date=datetime.now() + timedelta(days=1), duration=150),
        Spectacle(title="Shakespeare's Hamlet", description="A classic tragedy about power, revenge, and betrayal.", date=datetime.now() + timedelta(days=2), duration=180),
        Spectacle(title="The Lion King", description="A captivating musical that follows the life of Simba, the lion prince.", date=datetime.now() + timedelta(days=3), duration=120),
        Spectacle(title="Les Misérables", description="A dramatic and emotional story of love, sacrifice, and redemption.", date=datetime.now() + timedelta(days=4), duration=210),
        Spectacle(title="Wicked", description="The untold story of the witches of Oz.", date=datetime.now() + timedelta(days=5), duration=150),
        Spectacle(title="Mamma Mia!", description="A musical comedy featuring the songs of ABBA.", date=datetime.now() + timedelta(days=6), duration=140),
        Spectacle(title="Cats", description="A magical and unforgettable musical about a tribe of cats.", date=datetime.now() + timedelta(days=7), duration=120),
        Spectacle(title="Chicago", description="A jazz-infused musical about crime, corruption, and fame.", date=datetime.now() + timedelta(days=8), duration=130),
        Spectacle(title="Hamilton", description="The revolutionary musical about the founding father of the United States.", date=datetime.now() + timedelta(days=9), duration=160),
        Spectacle(title="The Wizard of Oz", description="A heartwarming story of a young girl and her adventure in the magical land of Oz.", date=datetime.now() + timedelta(days=10), duration=140)
    ]
    
    for spectacle in spectacles:
        db.session.add(spectacle)

    db.session.commit()

    seats = []
    for hall in halls:
        for row in range(1, 9):
            # Ustal liczbę miejsc w zależności od rzędu
            if row == 1:
                seats_in_row = 10
            elif row == 2:
                seats_in_row = 11
            elif row == 3:
                seats_in_row = 12
            elif row == 4:
                seats_in_row = 13
            elif 5 <= row <= 8:
                seats_in_row = 14

            for seat_number in range(1, seats_in_row + 1):
                seat = Seat(hall_id=hall.hall_id, row=row, seat_number=seat_number)
                seats.append(seat)
                db.session.add(seat)

    db.session.commit()

    tickets = []
    for spectacle in spectacles:
        for seat in seats[:102]:
            ticket = Ticket(seat_id=seat.seat_id, spectacle_id=spectacle.spectacle_id, price=50.0)
            tickets.append(ticket)
            db.session.add(ticket)

    db.session.commit()

    for i, ticket in enumerate(tickets[:14]):
        ticket_sold = TicketSold(ticket_id=ticket.ticket_id, user_id=users[i % len(users)].user_id)
        db.session.add(ticket_sold)

    db.session.commit()

    print("Data has been successfully added!")
