from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

try:
    scaler = pickle.load(open("scaler.pkl","rb"))
    model = pickle.load(open("pcos_model.pkl","rb"))
    model_loaded = True
    print("✅ Model and scaler loaded successfully.")
except Exception as e:
    print(f"⚠️ Warning: Model or scaler not found or invalid: {e}. Using dummy model for testing.")
    model_loaded = False

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        features = np.array(data["features"]).reshape(1,-1)
        
        print(f"🔍 Model loaded status: {model_loaded}")
        if not model_loaded:
            # Dummy prediction for testing (can be replaced with real model)
            # PCOS indicators: irregular, weight, hair, pimples, skin, fastfood=1, exercise=0 = HIGH RISK
            score = 0.0
            if features[0][2] == 1: score += 0.25  # irregular cycles
            if features[0][4] == 1: score += 0.20  # weight gain
            if features[0][5] == 1: score += 0.15  # hair growth
            if features[0][6] == 1: score += 0.15  # pimples
            if features[0][7] == 1: score += 0.10  # skin darkening
            if features[0][8] == 1: score += 0.10  # fast food
            if features[0][9] == 0: score += 0.10  # no exercise
            
            bmi = features[0][1]
            if bmi > 25: score += 0.10
            
            # lower threshold for high risk to avoid false negatives
            prediction = 1 if score >= 0.35 else 0
            probability = max(min(score, 1.0), 0.0)
        else:
            print(f"🔍 Using trained model. Features: {features.tolist()}")
            features_scaled = scaler.transform(features)
            print(f"🔍 Scaled features: {features_scaled}")
            prediction = model.predict(features_scaled)
            probability = model.predict_proba(features_scaled)
            print(f"🔍 Raw prediction: {prediction}, Raw probability: {probability}")
            prediction = int(prediction[0])
            probability = float(probability[0][1])
            print(f"🔍 Final prediction: {prediction}, Final probability: {probability}")
        
        return jsonify({
            "prediction": prediction,
            "probability": probability,
            "risk_level": "High" if prediction == 1 else "Low"
        })
    except Exception as e:
        print(f"Error in predict: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model_loaded": model_loaded
    })

@app.route("/metrics", methods=["GET"])
def metrics():
    # Optional - return model loaded + fallback hints
    return jsonify({
        "model_loaded": model_loaded,
        "note": "If model_loaded=false, backend uses heuristic fallback scoring. Train model with train_model.py and restart server."
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)