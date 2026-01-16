# backend/app.py
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

# Database Configuration 

load_dotenv()

app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)
db = mongo.db.overlays

# --- CRUD APIs for Overlays  ---

@app.route('/overlays', methods=['POST'])
def create_overlay():
    data = request.json
   
    new_overlay = {
        "content": data.get("content"), 
        "type": data.get("type", "text"),
        "x": data.get("x", 50),
        "y": data.get("y", 50),
        "width": data.get("width", 200),
        "height": data.get("height", 100)
    }
    result = db.insert_one(new_overlay)
    return jsonify({"_id": str(result.inserted_id), "message": "Overlay Created"}), 201


@app.route('/overlays', methods=['GET'])
def get_overlays():
    overlays = []
    for doc in db.find():
        doc['_id'] = str(doc['_id'])
        overlays.append(doc)
    return jsonify(overlays), 200


@app.route('/overlays/<id>', methods=['PUT'])
def update_overlay(id):
    data = request.json
    db.update_one({'_id': ObjectId(id)}, {'$set': data})
    return jsonify({"message": "Overlay Updated"}), 200


@app.route('/overlays/<id>', methods=['DELETE'])
def delete_overlay(id):
    db.delete_one({'_id': ObjectId(id)})
    return jsonify({"message": "Overlay Deleted"}), 200


try:
    mongo.cx.server_info() # Tries to ping the database
    print("✅ Successfully connected to MongoDB!")
except Exception as e:
    print("❌ Could not connect to MongoDB. Is it running?")
    print(e)


if __name__ == '__main__':
    app.run(debug=True, port=5000)