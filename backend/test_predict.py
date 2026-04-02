import requests

# Test high-risk PCOS case
features = [28, 32, 1, 40, 1, 1, 1, 1, 1, 0]  # age, bmi, irregular, cycle, weight, hair, pimples, skin, fastfood, exercise

try:
    response = requests.post('http://127.0.0.1:5000/predict', json={'features': features}, timeout=5)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")