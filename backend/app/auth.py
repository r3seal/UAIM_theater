from flask import Blueprint, request, jsonify
from .models import User
from . import db
from flask_jwt_extended import (get_jwt, jwt_required, create_access_token, create_refresh_token, get_jwt_identity, set_access_cookies, set_refresh_cookies, unset_jwt_cookies, unset_access_cookies)
from datetime import timedelta
from email_validator import validate_email, EmailNotValidError

# Creating the blueprint
auth_blueprint = Blueprint('auth', __name__)

# Function to validate email format
def validate_email_format(email):
    try:
        validate_email(email)
        return True
    except EmailNotValidError as e:
        return False

# User registration route
@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Validate email format
    if not validate_email_format(data['email']):
        return jsonify({'message': 'Invalid email format'}), 400

    # Check if the user already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'message': 'User already exists'}), 400

    # Default role is 'user' if not provided
    u_role = data.get('role', 'user')
    # Creating a new user
    new_user = User(
        name=data['name'],
        email=data['email'],
        phone=data.get('phone', None),
        role=u_role
    )
    new_user.set_password(data['password'])
    
    # Adding the new user to the database
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

# User login route
@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if user and user.check_password(data['password']):
        # Creating access and refresh tokens
        access_token = create_access_token(identity=str(user.user_id), additional_claims={'role': user.role.value}, expires_delta=timedelta(hours=1))
        refresh_token = create_refresh_token(identity=str(user.user_id), additional_claims={'role': user.role.value}, expires_delta=timedelta(hours=1))
        
        response = jsonify({
            "id": user.user_id,
            "permission": user.role.value,
            "access_token": access_token,
            "refresh_token": refresh_token
        })
        
        # Setting JWT tokens as cookies
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        
        return response, 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

# Token refresh route
@auth_blueprint.route('/token/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    # Get the user ID from the JWT identity
    user_id = get_jwt_identity()
    jwt_data = get_jwt()
    current_user_role = jwt_data.get('role')
    
    # Creating a new access token
    access_token = create_access_token(identity=str(user_id), additional_claims={'role': current_user_role}, expires_delta=timedelta(hours=1))
    
    response = jsonify({
        "access_token": access_token,
        "user_id": user_id,
        "role": current_user_role
    })
    
    # Setting the new access token as a cookie
    set_access_cookies(response, access_token)

    return response

# User logout route
@auth_blueprint.route('/logout', methods=['POST'])
def logout():
    response = jsonify({"message": "Successfully logged out"})
    
    # Unsetting JWT cookies (access token and refresh token)
    unset_jwt_cookies(response)
    
    return response, 200
