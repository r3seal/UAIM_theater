from flask import Blueprint, jsonify
from .models import User
from . import db
from flask_login import login_required, current_user
from .models import RoleEnum
import logging

logging.basicConfig(level=logging.DEBUG)

users_blueprint = Blueprint('users', __name__)
@users_blueprint.route('/', methods=['GET'])
@login_required
def get_users():
    logging.debug(f"Current user role: {current_user.role}")
    if current_user.role == RoleEnum.admin:
        users = User.query.all()
        return jsonify([
            {
                "user_id": user.user_id,
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "role": user.role.value  # Konwersja na string podczas serializacji
            }
            for user in users
        ])
    return jsonify({'message': 'Not allowed'}), 401
