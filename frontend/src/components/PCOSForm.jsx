import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

function PCOSForm() {
  const [form, setForm] = useState({
    age: "",
    bmi: "",
    irregular: "",
    cycle: "",
    weight: "",
    hair: "",
    pimples: "",
    skin: "",
    fastfood: "",
    exercise: ""
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const predictPCOS = async () => {

    // ✅ Validation
    for (let key in form) {
      if (form[key] === "") {
        alert("Please fill all fields");
        return;
      }
    }

    const features = Object.values(form).map(Number);

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features })
      });

      const data = await response.json();

      // 🔥 SAVE TO FIREBASE
      await addDoc(collection(db, "predictions"), {
        ...form,
        prediction: data.prediction,
        createdAt: new Date()
      });

      console.log("✅ Saved to Firebase");

      setResult(
        data.prediction === 1
          ? "⚠️ PCOS Risk Detected"
          : "✅ Low Risk"
      );

    } catch (error) {
      console.error("Error:", error);
      setResult("❌ Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: "450px",
      margin: "auto",
      padding: "20px",
      borderRadius: "12px",
      background: "#f5f7fa",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center" }}>PCOS Prediction</h2>

      <input name="age" placeholder="Age" onChange={handleChange} />
      <input name="bmi" placeholder="BMI" onChange={handleChange} />
      <input name="irregular" placeholder="Irregular (1/0)" onChange={handleChange} />
      <input name="cycle" placeholder="Cycle Length" onChange={handleChange} />
      <input name="weight" placeholder="Weight Gain (1/0)" onChange={handleChange} />
      <input name="hair" placeholder="Hair Growth (1/0)" onChange={handleChange} />
      <input name="pimples" placeholder="Pimples (1/0)" onChange={handleChange} />
      <input name="skin" placeholder="Skin Darkening (1/0)" onChange={handleChange} />
      <input name="fastfood" placeholder="Fast Food (1/0)" onChange={handleChange} />
      <input name="exercise" placeholder="Exercise (1/0)" onChange={handleChange} />

      <button
        onClick={predictPCOS}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "10px",
          border: "none",
          borderRadius: "8px",
          background: "#ff4d8d",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        {loading ? "Predicting..." : "Predict"}
      </button>

      <a href="/history" style={{
  display: "block",
  textAlign: "center",
  marginTop: "15px",
  color: "#ff4d8d",
  fontWeight: "bold"
}}>
  View Prediction History
</a>

      <h3 style={{ textAlign: "center", marginTop: "15px" }}>
        {result}
      </h3>
    </div>
  );
}

export default PCOSForm;