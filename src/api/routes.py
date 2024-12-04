"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/user', methods=['POST'])
def create_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if None in [email, password]:
        return jsonify({
            'message: ': 'Email and Password requierd'
        }), 400
    email_exist = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()
    if email_exist:
        return jsonify({
            'message: ': 'Unable to create user... try again'
        }), 400
    password_hash = generate_password_hash(password)    
    new_user = User(email, password_hash)
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as error:
        return jsonify({
            'message: ': 'Database error'
        }), 500

    return jsonify({
            'user: ': new_user.serialize()
        }), 200

@api.route('/token', methods=['POST'])
def login():
	data = request.json
	email = data.get('email')
	password = data.get('password')
	if None in [email, password]:
		return jsonify({'message: ': 'Email and password required'})
	email_exists = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()
	if email_exists[0] is None:
		return jsonify({'message: ': 'Unable to login. Wrong email or password'}), 400
	user = email_exists[0]
	password_is_valid = check_password_hash(user.password_hash, password)
	if not password_is_valid:
		return jsonify({'message: ': 'Invalid email or password'}), 400
	token = create_access_token(identity=user.email)
	return jsonify({'token': token}), 201

@api.route('/user', methods=['GET'])
@jwt_required()
def get_private_data():
    user_mail = get_jwt_identity()
    user = db.session.execute(db.select(User).filter_by(email=user_mail)).scalar_one()
    return jsonify(user.private_serialize()), 200