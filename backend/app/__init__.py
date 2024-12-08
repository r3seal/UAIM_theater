# __init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from .config import Config
from flask_login import LoginManager
from flask_jwt_extended import JWTManager



db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicjalizacja bazy danych
    db.init_app(app)
    # Inicjalizacja migrate
    migrate.init_app(app, db)

    # login_manager = LoginManager()
    # login_manager.login_view = 'auth.login'
    # login_manager.init_app(app)

    jwt = JWTManager(app)

    #from .models import User

    # @login_manager.user_loader
    # def load_user(user_id):
    #     return User.query.get(int(user_id))

    # Rejestracja blueprintów
    from .auth import auth_blueprint
    from .admin import admin_blueprint
    from .spectacles import spectacles_blueprint
    app.register_blueprint(auth_blueprint, url_prefix='/auth')
    app.register_blueprint(admin_blueprint, url_prefix='/admin')
    app.register_blueprint(spectacles_blueprint, url_prefix='/spectacles')
    
    with app.app_context():
        #from . import models  # Importowanie modeli
        db.create_all()  # Tworzenie tabeli (jeśli jeszcze nie istnieją)

    return app