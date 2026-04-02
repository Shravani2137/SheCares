import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

function PCOSForm() {
  const { currentUser } = useAuth();
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
  const [probability, setProbability] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [showDietPlan, setShowDietPlan] = useState(false);

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

      if (data.error) {
        setResult("❌ " + data.error);
        return;
      }

      console.log("🔍 Backend Response:", data); // DEBUG LOG

      // 🔥 SAVE TO FIREBASE with user ID
      await addDoc(collection(db, "predictions"), {
        userId: currentUser.uid,
        ...form,
        prediction: data.prediction,
        probability: data.probability || 0,
        risk_level: data.risk_level,
        createdAt: new Date()
      });

      console.log("✅ Saved to Firebase:", data);

      setProbability(data.probability);
      setRiskLevel(data.risk_level);
      
      const riskPercentage = (data.probability * 100).toFixed(1);
      
      setResult(
        data.prediction === 1
          ? `⚠️ PCOS Risk Detected (${riskPercentage}% risk)`
          : `✅ Low PCOS Risk (${riskPercentage}% risk)`
      );

    } catch (error) {
      console.error("Error:", error);
      setResult("❌ Error: Could not connect to server. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const fillHighRiskTest = () => {
    setForm({
      age: "28",
      bmi: "32",
      irregular: "1",
      cycle: "40",
      weight: "1",
      hair: "1",
      pimples: "1",
      skin: "1",
      fastfood: "1",
      exercise: "0"
    });
  };

  const generateDietPlan = () => {
    const isHighRisk = riskLevel === "High";
    const age = parseInt(form.age);
    const bmi = parseFloat(form.bmi);

    let dietPlan = {
      title: isHighRisk ? "⚠️ PCOS Management Diet Plan" : "✅ Healthy Maintenance Diet Plan",
      subtitle: isHighRisk 
        ? "Designed for blood sugar control, hormone balance, and weight management"
        : "Balanced nutrition for overall wellness and PCOS prevention",
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
      tips: []
    };

    // Base meals for everyone
    if (isHighRisk) {
      // PCOS-specific diet
      dietPlan.breakfast = [
        "🌾 Steel-cut oats with cinnamon and berries (low-GI carbs)",
        "🥚 Vegetable omelet with spinach and tomatoes",
        "🥛 Greek yogurt with almonds and chia seeds",
        "🥤 Green smoothie with spinach, banana, and protein powder"
      ];
      
      dietPlan.lunch = [
        "🥗 Grilled chicken salad with quinoa and mixed greens",
        "🍲 Lentil soup with vegetables and whole grain bread",
        "🌯 Turkey wrap with avocado, lettuce, and cucumber",
        "🍚 Brown rice bowl with tofu and steamed broccoli"
      ];
      
      dietPlan.dinner = [
        "🐟 Baked salmon with sweet potato and asparagus",
        "🥩 Lean beef stir-fry with mixed vegetables",
        "🍛 Vegetable curry with chickpeas and cauliflower rice",
        "🍗 Grilled chicken with quinoa and green beans"
      ];
      
      dietPlan.snacks = [
        "🍎 Apple slices with almond butter",
        "🥕 Carrot sticks with hummus",
        "🥜 Handful of walnuts and pumpkin seeds",
        "🫐 Mixed berries with a sprinkle of cinnamon"
      ];
      
      dietPlan.tips = [
        "⚡ Limit refined carbs and sugars to control blood sugar",
        "🌾 Choose low-GI foods (oats, quinoa, sweet potatoes)",
        "🥄 Add cinnamon to meals for natural blood sugar control",
        "💧 Stay hydrated with 8-10 glasses of water daily",
        "🏃‍♀️ Include 30 minutes of exercise daily",
        "📊 Monitor portion sizes and eat every 3-4 hours",
        "🥗 Focus on anti-inflammatory foods (fatty fish, nuts, leafy greens)",
        "🚫 Avoid processed foods and sugary drinks"
      ];
      
      // Age-specific adjustments
      if (age < 25) {
        dietPlan.tips.push("🥛 Include calcium-rich foods for bone health");
      } else if (age > 35) {
        dietPlan.tips.push("🌿 Add more anti-inflammatory spices (turmeric, ginger)");
      }
      
      // BMI-specific adjustments
      if (bmi > 30) {
        dietPlan.tips.unshift("⚖️ Focus on gradual weight loss (0.5-1kg per week)");
        dietPlan.tips.push("🥗 Increase vegetable intake, reduce portion sizes");
      }
      
    } else {
      // Low-risk maintenance diet
      dietPlan.breakfast = [
        "🥑 Avocado toast on whole grain bread with eggs",
        "🥣 Smoothie bowl with mixed fruits and granola",
        "🍳 Veggie scramble with whole grain toast",
        "🥛 Yogurt parfait with berries and nuts"
      ];
      
      dietPlan.lunch = [
        "🥗 Mediterranean salad with grilled chicken",
        "🍝 Whole wheat pasta with vegetables and lean protein",
        "🌯 Veggie wrap with hummus and mixed greens",
        "🍱 Buddha bowl with quinoa and roasted vegetables"
      ];
      
      dietPlan.dinner = [
        "🐟 Grilled fish with brown rice and seasonal vegetables",
        "🥩 Lean meat with sweet potato and green salad",
        "🍛 Stir-fried tofu with mixed vegetables and rice",
        "🍗 Baked chicken with quinoa and steamed broccoli"
      ];
      
      dietPlan.snacks = [
        "🍌 Fresh fruit with a handful of nuts",
        "🥒 Vegetable sticks with guacamole",
        "🧀 Cottage cheese with cherry tomatoes",
        "🍯 Greek yogurt with honey and granola"
      ];
      
      dietPlan.tips = [
        "⚖️ Maintain balanced macronutrients (40% carbs, 30% protein, 30% fats)",
        "🌈 Include variety of colorful vegetables daily",
        "🌾 Choose whole grains over refined grains",
        "🥜 Include healthy fats (avocados, nuts, olive oil)",
        "💧 Drink plenty of water throughout the day",
        "🏃‍♀️ Stay active with regular exercise",
        "📊 Listen to your body's hunger cues",
        "🥗 Focus on nutrient-dense whole foods"
      ];
    }

    return dietPlan;
  };

  return (
    <div style={{
      maxWidth: "500px",
      margin: "auto",
      padding: "25px",
      borderRadius: "12px",
      background: "#f5f7fa",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", color: "#ff4d8d" }}>🩺 PCOS Risk Assessment</h2>
      <p style={{textAlign: "center", color: "#666", fontSize: "14px"}}>Answer all questions accurately for best results</p>

      <button
        onClick={fillHighRiskTest}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          border: "none",
          borderRadius: "6px",
          background: "#ff9800",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        🧪 Fill High-Risk Test Case
      </button>

      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px"}}>
        <input name="age" type="number" placeholder="Age (years)" onChange={handleChange} style={inputStyle} />
        <input name="bmi" type="number" placeholder="BMI (kg/m²)" onChange={handleChange} style={inputStyle} step="0.1" />
        <input name="cycle" type="number" placeholder="Cycle Length (days)" onChange={handleChange} style={inputStyle} />
        
        <select name="irregular" onChange={handleChange} style={inputStyle}>
          <option value="">Irregular Cycles?</option>
          <option value="0">No (0)</option>
          <option value="1">Yes (1)</option>
        </select>
        
        <select name="weight" onChange={handleChange} style={inputStyle}>
          <option value="">Weight Gain?</option>
          <option value="0">No (0)</option>
          <option value="1">Yes (1)</option>
        </select>
        
        <select name="hair" onChange={handleChange} style={inputStyle}>
          <option value="">Excess Hair Growth?</option>
          <option value="0">No (0)</option>
          <option value="1">Yes (1)</option>
        </select>
        
        <select name="pimples" onChange={handleChange} style={inputStyle}>
          <option value="">Pimples/Acne?</option>
          <option value="0">No (0)</option>
          <option value="1">Yes (1)</option>
        </select>
        
        <select name="skin" onChange={handleChange} style={inputStyle}>
          <option value="">Skin Darkening?</option>
          <option value="0">No (0)</option>
          <option value="1">Yes (1)</option>
        </select>
        
        <select name="fastfood" onChange={handleChange} style={inputStyle}>
          <option value="">Fast Food Habits?</option>
          <option value="0">No (0)</option>
          <option value="1">Yes (1)</option>
        </select>
        
        <select name="exercise" onChange={handleChange} style={inputStyle}>
          <option value="">Regular Exercise?</option>
          <option value="0">No (0)</option>
          <option value="1">Yes (1)</option>
        </select>
      </div>

      <button
        onClick={predictPCOS}
        style={{
          width: "100%",
          padding: "14px",
          marginTop: "20px",
          border: "none",
          borderRadius: "8px",
          background: "#ff4d8d",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        {loading ? "⏳ Analyzing..." : "🔍 Get Assessment"}
      </button>

      {probability !== null && (
        <div style={{
          marginTop: "20px",
          padding: "15px",
          background: probability > 0.5 ? "#ffe5e5" : "#e5f5e5",
          borderRadius: "8px",
          textAlign: "center",
          border: `2px solid ${probability > 0.5 ? "#ff4d8d" : "#4CAF50"}`
        }}>
          <h3 style={{margin: "0 0 10px 0", color: probability > 0.5 ? "#ff4d8d" : "#4CAF50"}}>
            {riskLevel === "High" ? "⚠️ High PCOS Risk" : "✅ Low PCOS Risk"}
          </h3>
          <p style={{margin: "0", fontSize: "18px", fontWeight: "bold"}}>
            {(probability * 100).toFixed(1)}% Risk Score
          </p>
          <p style={{margin: "5px 0 0 0", fontSize: "12px", color: "#666"}}>
            {probability > 0.7 ? "Consult a gynecologist urgently" : probability > 0.5 ? "Schedule a check-up soon" : "Continue healthy lifestyle"}
          </p>
          
          <button
            onClick={() => setShowDietPlan(!showDietPlan)}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              background: "#ff4d8d",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            {showDietPlan ? "🔽 Hide Diet Plan" : "🥗 Generate Diet Plan"}
          </button>
        </div>
      )}

      {result && !probability && (
        <h3 style={{ textAlign: "center", marginTop: "15px", color: "#d32f2f" }}>
          {result}
        </h3>
      )}

      {showDietPlan && probability !== null && (
        <div style={{
          marginTop: "20px",
          padding: "20px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          border: "1px solid #eee"
        }}>
          {(() => {
            const dietPlan = generateDietPlan();
            return (
              <>
                <div style={{
                  background: riskLevel === "High" ? "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)" : "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  textAlign: "center"
                }}>
                  <h3 style={{margin: "0 0 5px 0", color: riskLevel === "High" ? "#c62828" : "#2e7d32"}}>
                    {dietPlan.title}
                  </h3>
                  <p style={{margin: "0", fontSize: "14px", color: riskLevel === "High" ? "#d32f2f" : "#388e3c"}}>
                    {dietPlan.subtitle}
                  </p>
                </div>

                <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px", marginBottom: "20px"}}>
                  <div style={mealCardStyle}>
                    <h4 style={{color: "#ff6f00", margin: "0 0 10px 0", fontSize: "16px"}}>🌅 Breakfast</h4>
                    {dietPlan.breakfast.map((item, i) => (
                      <p key={i} style={{margin: "6px 0", fontSize: "13px"}}>✓ {item}</p>
                    ))}
                  </div>

                  <div style={mealCardStyle}>
                    <h4 style={{color: "#ff6f00", margin: "0 0 10px 0", fontSize: "16px"}}>☀️ Lunch</h4>
                    {dietPlan.lunch.map((item, i) => (
                      <p key={i} style={{margin: "6px 0", fontSize: "13px"}}>✓ {item}</p>
                    ))}
                  </div>

                  <div style={mealCardStyle}>
                    <h4 style={{color: "#ff6f00", margin: "0 0 10px 0", fontSize: "16px"}}>🌙 Dinner</h4>
                    {dietPlan.dinner.map((item, i) => (
                      <p key={i} style={{margin: "6px 0", fontSize: "13px"}}>✓ {item}</p>
                    ))}
                  </div>

                  <div style={mealCardStyle}>
                    <h4 style={{color: "#ff6f00", margin: "0 0 10px 0", fontSize: "16px"}}>🍿 Snacks</h4>
                    {dietPlan.snacks.map((item, i) => (
                      <p key={i} style={{margin: "6px 0", fontSize: "13px"}}>✓ {item}</p>
                    ))}
                  </div>
                </div>

                <div style={{
                  background: "#f8f9fa",
                  padding: "15px",
                  borderRadius: "8px",
                  borderLeft: "4px solid #ff4d8d"
                }}>
                  <h4 style={{margin: "0 0 10px 0", color: "#ff4d8d", fontSize: "16px"}}>💡 Key Recommendations</h4>
                  <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "8px"}}>
                    {dietPlan.tips.map((tip, i) => (
                      <p key={i} style={{margin: "4px 0", fontSize: "12px", color: "#555"}}>• {tip}</p>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      <div style={{marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center"}}>
        <a href="/nutrition" style={{padding: "8px 16px", background: "#e8f4fd", color: "#2196F3", textDecoration: "none", borderRadius: "6px", fontSize: "13px"}}>
          📋 View Diet Plan
        </a>
        <a href="/history" style={{padding: "8px 16px", background: "#f0f0f0", color: "#666", textDecoration: "none", borderRadius: "6px", fontSize: "13px"}}>
          📚 View History
        </a>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "14px",
  boxSizing: "border-box"
};

const mealCardStyle = {
  background: "#f8f9fa",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #e9ecef",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
};

export default PCOSForm;