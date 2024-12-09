

from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from .models import User
from . import db
from flask_login import login_user # type: ignore
from flask_jwt_extended import (get_jwt, jwt_required, create_access_token, create_refresh_token, get_jwt_identity, set_access_cookies, set_refresh_cookies, unset_jwt_cookies, unset_access_cookies)
from datetime import timedelta


# Tworzymy blueprint
auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Sprawdzenie, czy użytkownik już istnieje
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'message': 'User already exists'}), 400

    u_role = data.get('role', 'user')
    # Tworzenie nowego użytkownika
    new_user = User(
        name=data['name'],
        email=data['email'],
        phone=data.get('phone', None),
        role=u_role
    )
    new_user.set_password(data['password'])
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201


@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if user and user.check_password(data['password']):
        access_token = create_access_token( identity=str(user.user_id), additional_claims={'role': user.role.value}, expires_delta=timedelta(hours=1))
        refresh_token = create_refresh_token(identity= str(user.user_id), additional_claims={'role': user.role.value}, expires_delta=timedelta(hours=1))
        response = {
            "id": user.user_id,
            "permission": user.role.value,
            "access_token": access_token,
            "refresh_token": refresh_token
        }
        return jsonify(response), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401


@auth_blueprint.route('/token/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    user_id = get_jwt_identity()
    jwt_data = get_jwt()
    current_user_role = jwt_data.get('role')
    access_token = create_access_token( identity=str(user_id), additional_claims={'role': current_user_role}, expires_delta=timedelta(hours=1))
    response = {
        "access_token": access_token
    }
    return jsonify(response)