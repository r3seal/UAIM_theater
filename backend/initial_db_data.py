from app import create_app, db 
from app.models import Hall, Seat, Spectacle, User, RoleEnum

app = create_app()


with app.app_context():


    # Add halls
    hall1 = Hall(name="Main Hall", capacity=100)
    hall2 = Hall(name="Small Hall", capacity=100)

    # Add data to the session and commit to generate `hall_id`
    db.session.add(hall1)
    db.session.add(hall2)
    db.session.commit()

    # Generate seats for each hall
    for hall in [hall1, hall2]:
        for row in range(1, 11):  # 10 rows
            for seat_number in range(1, 11):  # 10 seats per row
                seat = Seat(hall_id=hall.hall_id, row=row, seat_number=seat_number)
                db.session.add(seat)

    db.session.commit()

    # Add users
    admin = User(name="Admin User", email="admin@example.com", phone="123456789", role=RoleEnum.admin)
    user1 = User(name="User One", email="user1@example.com", phone="123456789", role=RoleEnum.user)
    user2 = User(name="User Two", email="user2@example.com", phone="123456789", role=RoleEnum.user)

    # Set passwords for the users (using the `set_password` method from the `User` model)
    admin.set_password("adminpassword")
    user1.set_password("user1password")
    user2.set_password("user2password")

    # Add users to the session
    db.session.add(admin)
    db.session.add(user1)
    db.session.add(user2)

    # Commit the data to the database
    db.session.commit()

    print("Data has been successfully added!")
