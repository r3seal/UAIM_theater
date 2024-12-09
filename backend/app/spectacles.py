from flask import Blueprint, jsonify
from .models import User
from . import db
from .models import RoleEnum, Ticket, Spectacle
import logging
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

logging.basicConfig(level=logging.DEBUG)

spectacles_blueprint = Blueprint('spectacles', __name__)


@spectacles_blueprint.route('/', methods=['GET'])
def get_spectacles():
    spectacles = Spectacle.query.all()
    return jsonify([
        {
            "spectatle_id": spectacle.spectacle_id,
            "title": spectacle.title,
            "description": spectacle.description,
            "date": spectacle.date,
            "duration": spectacle.duration

        }
        for spectacle in spectacles
    ])