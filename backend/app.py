from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS
scaler = pickle.load(open("scaler.pkl","rb"))

app = Flask(__name__)
CORS(app)

# model load (IMPORTANT path)
model = pickle.load(open("pcos_model.pkl","rb"))

@app.route("/predict", methods=["POST"])
def predict():

    data = request.json
    features = np.array(data["features"]).reshape(1,-1)
    features = scaler.transform(features)
    prediction = model.predict(features)

    return jsonify({"prediction": int(prediction[0])})

if __name__ == "__main__":
    app.run(debug=True)