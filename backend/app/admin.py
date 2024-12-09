from flask import Blueprint, jsonify
from .models import User
from .models import RoleEnum
import logging
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

logging.basicConfig(level=logging.DEBUG)

admin_blueprint = Blueprint('admin', __name__)


@admin_blueprint.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    current_user_id = get_jwt_identity()
    jwt_data = get_jwt()
    current_user_role = jwt_data.get('role')
    logging.debug(f"Current user ID: {current_user_id}, Role: {current_user_role}")
    if current_user_role != RoleEnum.admin:
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
