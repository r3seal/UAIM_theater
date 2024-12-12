# __init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from .config import Config
from flask_mail import Mail
from flask_login import LoginManager
from flask_jwt_extended import JWTManager



db = SQLAlchemy()
migrate = Migrate()
mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Database initialization
    db.init_app(app)
    # Migrate Initialization
    migrate.init_app(app, db)


    jwt = JWTManager(app)

    # Blueprints registery
    from .auth import auth_blueprint
    from .admin import admin_blueprint
    from .spectacles import spectacles_blueprint
    app.register_blueprint(auth_blueprint, url_prefix='/auth')
    app.register_blueprint(admin_blueprint, url_prefix='/admin')
    app.register_blueprint(spectacles_blueprint, url_prefix='/spectacles')
    
    with app.app_context():
        db.create_all() 

    return app