from flask import current_app, jsonify
from .models import User
from . import db

@current_app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.as_dict() for user in users])

# Funkcja pomocnicza, aby model zwracał słownik
User.as_dict = lambda self: {c.name: getattr(self, c.name) for c in self.__table__.columns}
