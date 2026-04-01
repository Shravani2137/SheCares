import pandas as pd
import pickle

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

# ✅ Load dataset
data = pd.read_csv("../PCOS-PREDICTION-PROJECT/PCOS_data.csv")

# ✅ Clean column names
data.columns = data.columns.str.strip()

# ✅ Select features (same as frontend)
data = data[[
    "Age (yrs)",
    "BMI",
    "Cycle(R/I)",
    "Cycle length(days)",
    "Weight gain(Y/N)",
    "hair growth(Y/N)",
    "Pimples(Y/N)",
    "Skin darkening (Y/N)",
    "Fast food (Y/N)",
    "Reg.Exercise(Y/N)",
    "PCOS (Y/N)"
]]

# ✅ Rename
data.columns = [
    "age","bmi","irregular","cycle",
    "weight","hair","pimples","skin",
    "fastfood","exercise","PCOS"
]

# ✅ Clean data
data = data.dropna()

# Features & target
X = data.drop("PCOS", axis=1)
y = data["PCOS"]

# ✅ Scale data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

# =========================
# 🔥 MODEL COMPARISON
# =========================

# Model 1: Logistic Regression
lr = LogisticRegression()
lr.fit(X_train, y_train)
lr_pred = lr.predict(X_test)
lr_acc = accuracy_score(y_test, lr_pred)

# Model 2: Random Forest
rf = RandomForestClassifier(n_estimators=300, max_depth=10)
rf.fit(X_train, y_train)
rf_pred = rf.predict(X_test)
rf_acc = accuracy_score(y_test, rf_pred)

print("Logistic Regression Accuracy:", lr_acc)
print("Random Forest Accuracy:", rf_acc)

# ✅ Choose best model
best_model = rf if rf_acc > lr_acc else lr

print("✅ Best model selected:", "Random Forest" if rf_acc > lr_acc else "Logistic")

# =========================
# SAVE MODEL + SCALER
# =========================

pickle.dump(best_model, open("pcos_model.pkl", "wb"))
pickle.dump(scaler, open("scaler.pkl", "wb"))

print("🔥 Model & scaler saved successfully!")