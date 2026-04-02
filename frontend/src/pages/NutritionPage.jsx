import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

function NutritionPage() {
  const { currentUser } = useAuth();
  const [mode, setMode] = useState("default"); 
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    age: "",
    weight: "",
    height: "",
    goal: "maintenance",
    activity: "moderate",
    restrictions: ""
  });

  const [diet, setDiet] = useState(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "predictions"),
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc"),
          limit(1)
        );

        const snapshot = await getDocs(q);
        if (snapshot.docs.length > 0) {
          const data = snapshot.docs[0].data();
          setPrediction(data.prediction);
        }
      } catch (error) {
        console.error("Error fetching prediction:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [currentUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateDiet = () => {
    if (!form.age || !form.weight || !form.goal) {
      alert("Please fill in age, weight, and goal!");
      return;
    }

    let dietPlan = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
      tips: [],
      goal: form.goal
    };

    const ageNum = parseInt(form.age);
    if (ageNum < 25) {
      dietPlan.tips.push("🥛 Focus on calcium-rich foods for bone health");
    } else if (ageNum > 35) {
      dietPlan.tips.push("🌿 Include anti-inflammatory foods to reduce PCOS symptoms");
    }

    if (form.goal === "weight_loss") {
      dietPlan.breakfast = ["🥗 Oatmeal with berries and chia seeds", "🍨 Greek yogurt with almonds", "🥤 Green smoothie", "🍳 Vegetable omelet"];
      dietPlan.lunch = ["🥙 Grilled chicken salad with quinoa", "🍲 Lentil soup with vegetables", "🌯 Turkey wrap with veggies", "🍜 Brown rice bowl"];
      dietPlan.dinner = ["🐟 Baked fish with steamed broccoli", "🍜 Stir-fried tofu with mixed greens", "🥩 Grilled lean meat with salad", "🍲 Vegetable curry"];
      dietPlan.snacks = ["🍎 Apple with almond butter", "🥕 Carrot sticks with hummus", "🥜 Handful of walnuts", "🫐 Berries"];
      dietPlan.tips.push("⚡ Aim for 500 calorie deficit daily", "💧 Drink 8-10 glasses of water", "🏃‍♀️ Exercise 30 minutes daily", "📊 Track your portions");
    } else if (form.goal === "weight_gain") {
      dietPlan.breakfast = ["🥑 Avocado toast with eggs", "🥤 Smoothie with banana and peanut butter", "🥣 Whole grain cereal with milk", "🍌 Fruit with nuts"];
      dietPlan.lunch = ["🍗 Chicken rice bowl", "🍝 Pasta with vegetables and protein", "🧀 Sandwich with avocado and cheese", "🍱 Mixed grain bowl"];
      dietPlan.dinner = ["🐟 Salmon with sweet potato", "🥩 Beef stir-fry with rice", "🍝 Pasta with meat sauce", "🍗 Grilled chicken with rice"];
      dietPlan.snacks = ["🥜 Trail mix", "🧀 Cheese and crackers", "🍌 Fruit with yogurt", "🥜 Peanut butter smoothie"];
      dietPlan.tips.push("🎯 Focus on nutrient-dense calories", "🥗 Include healthy fats", "💪 Strength training 3x per week", "📈 Increase portion sizes");
    } else {
      dietPlan.breakfast = ["🍞 Whole grain toast with avocado", "🥣 Smoothie bowl", "🍳 Eggs with vegetables", "🥗 Fruit with yogurt"];
      dietPlan.lunch = ["🥗 Quinoa salad with chicken", "🍜 Vegetable stir-fry with tofu", "🌯 Turkey and vegetable wrap", "🍱 Balanced grain bowl"];
      dietPlan.dinner = ["🐟 Grilled fish with brown rice", "🥩 Lean meat with vegetables", "🍲 Vegetable curry with lentils", "🍝 Whole wheat pasta"];
      dietPlan.snacks = ["🍨 Greek yogurt", "🍌 Fresh fruit", "🥜 Nuts and seeds", "🥕 Vegetable sticks"];
      dietPlan.tips.push("⚖️ Maintain balanced macronutrients (40% carbs, 30% protein, 30% fats)", "🌈 Include variety of colorful vegetables", "🌾 Choose whole grains over refined", "🧘 Regular exercise routine");
    }

    if (prediction === 1) {
      dietPlan.tips.unshift("⚠️ PCOS-Specific: Limit refined carbs and sugars");
      dietPlan.tips.push("🍂 Choose low-GI foods", "🥄 Include cinnamon for blood sugar control");
      dietPlan.breakfast.unshift("🌾 Overnight oats with cinnamon");
      dietPlan.snacks.push("🍎 Cinnamon-spiced apple");
    }

    setDiet(dietPlan);
  };

  if (loading) {
    return (
      <div style={{textAlign: "center", marginTop: "150px", fontSize: "20px", color: "#ff4d8d"}}>
        ⏳ Loading nutrition data...
      </div>
    );
  }

  return (
    <div style={{background: "linear-gradient(135deg, #fff5fa 0%, #f0f9ff 100%)", minHeight: "100vh", paddingTop: "20px", paddingBottom: "40px"}}>
      <div style={{maxWidth: "1200px", margin: "0 auto", padding: "0 20px"}}>

        {/* Header */}
        <div style={{textAlign: "center", marginBottom: "40px"}}>
          <h1 style={{color: "#ff4d8d", fontSize: "2.5em", margin: "0 0 10px 0"}}>🥗 Nutrition & Diet Plans</h1>
          <p style={{color: "#666", fontSize: "1.1em"}}>Personalized diet suggestions for women's hormonal health</p>
          {prediction === 1 && (
            <div style={{background: "#ffebee", color: "#c62828", padding: "12px 20px", borderRadius: "8px", display: "inline-block", marginTop: "15px", fontSize: "14px"}}>
              ⚠️ Your PCOS risk is detected. Following a PCOS-friendly diet is recommended.
            </div>
          )}
        </div>

        {/* Mode Selection Buttons */}
        <div style={{display: "flex", gap: "15px", justifyContent: "center", marginBottom: "40px", flexWrap: "wrap"}}>
          <button 
            onClick={()=>setMode("prediction")} 
            style={{
              ...modeBtn,
              background: mode === "prediction" ? "#ff4d8d" : "#f0f0f0",
              color: mode === "prediction" ? "white" : "#333"
            }}
          >
            📊 PCOS-Based Diet
          </button>

          <button 
            onClick={()=>setMode("custom")} 
            style={{
              ...modeBtn,
              background: mode === "custom" ? "#ff4d8d" : "#f0f0f0",
              color: mode === "custom" ? "white" : "#333"
            }}
          >
            ⚙️ Custom Diet Plan
          </button>

          <button 
            onClick={()=>setMode("default")} 
            style={{
              ...modeBtn,
              background: mode === "default" ? "#ff4d8d" : "#f0f0f0",
              color: mode === "default" ? "white" : "#333"
            }}
          >
            📚 General Guide
          </button>
        </div>

        {/* MODE 1: PCOS-Based Diet */}
        {mode === "prediction" && (
          <div>
            {prediction === null ? (
              <div style={{background: "white", padding: "40px", borderRadius: "12px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.1)"}}>
                <h3 style={{color: "#ff4d8d"}}>📝 No Prediction Yet</h3>
                <p>Complete a PCOS assessment to get a personalized diet plan based on your risk level.</p>
                <a href="/pcos" style={{display: "inline-block", marginTop: "15px", padding: "12px 30px", background: "#ff4d8d", color: "white", textDecoration: "none", borderRadius: "8px", fontWeight: "bold"}}>
                  Take PCOS Assessment
                </a>
              </div>
            ) : prediction === 1 ? (
              <div>
                <div style={{background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)", padding: "30px", borderRadius: "12px", marginBottom: "30px"}}>
                  <h2 style={{color: "#c62828", margin: 0}}>⚠️ PCOS Management Diet Plan</h2>
                  <p style={{color: "#d32f2f", marginTop: "10px"}}>Designed for blood sugar control, hormone balance, and weight management</p>
                </div>

                <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px"}}>
                  <div style={mealCard}>
                    <h3 style={{color: "#ff6f00", margin: "0 0 15px 0"}}>🌅 Breakfast (8-9 AM)</h3>
                    {["Steel-cut oats with cinnamon and berries", "Greek yogurt with cinnamon and almonds", "Vegetable omelet with spinach", "Green tea with whole grain toast"].map((item, i) => (
                      <p key={i} style={{margin: "8px 0"}}>✓ {item}</p>
                    ))}
                  </div>

                  <div style={mealCard}>
                    <h3 style={{color: "#ff6f00", margin: "0 0 15px 0"}}>☀️ Lunch (1-2 PM)</h3>
                    {["Grilled chicken with quinoa salad", "Lentil and vegetable soup", "Turkey wrap with avocado and greens", "Brown rice with stir-fried vegetables"].map((item, i) => (
                      <p key={i} style={{margin: "8px 0"}}>✓ {item}</p>
                    ))}
                  </div>

                  <div style={mealCard}>
                    <h3 style={{color: "#ff6f00", margin: "0 0 15px 0"}}>🌙 Dinner (7-8 PM)</h3>
                    {["Baked salmon with steamed broccoli", "Tofu stir-fry with mixed greens", "Lean beef with sweet potato", "Vegetable curry with chickpeas"].map((item, i) => (
                      <p key={i} style={{margin: "8px 0"}}>✓ {item}</p>
                    ))}
                  </div>

                  <div style={mealCard}>
                    <h3 style={{color: "#ff6f00", margin: "0 0 15px 0"}}>🍎 Snacks (Morning & Evening)</h3>
                    {["Apple with cinnamon", "Almonds (1 oz)", "Cinnamon-spiced pear", "Celery with almond butter"].map((item, i) => (
                      <p key={i} style={{margin: "8px 0"}}>✓ {item}</p>
                    ))}
                  </div>
                </div>

                <div style={{background: "#e1f5fe", padding: "25px", borderRadius: "12px", border: "2px solid #01579b"}}>
                  <h3 style={{color: "#01579b", marginTop: 0}}>🩺 PCOS Management Tips</h3>
                  <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px"}}>
                    {["✅ Limit refined carbohydrates and sugars", "✅ Choose low glycemic index foods (GI < 55)", "✅ Include anti-inflammatory foods: fatty fish, nuts, olive oil", "✅ Stay hydrated: 8-10 glasses of water daily", "✅ Consider supplements: Inositol, Vitamin D, Omega-3", "✅ Regular exercise: 30 minutes moderate activity daily", "✅ Monitor blood sugar levels", "✅ Consult healthcare provider for personalized guidance"].map((tip, i) => (
                      <p key={i} style={{margin: "8px 0", color: "#01579b"}}>{tip}</p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)", padding: "30px", borderRadius: "12px", marginBottom: "30px"}}>
                  <h2 style={{color: "#2e7d32", margin: 0}}>✅ Healthy Maintenance Diet Plan</h2>
                  <p style={{color: "#388e3c", marginTop: "10px"}}>Designed for overall wellness and balanced nutrition</p>
                </div>

                <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px"}}>
                  <div style={mealCard}>
                    <h3 style={{color: "#00695c", margin: "0 0 15px 0"}}>🌅 Breakfast</h3>
                    {["Whole grain toast with avocado", "Smoothie bowl with fruits", "Eggs with vegetables", "Oatmeal with nuts and seeds"].map((item, i) => (
                      <p key={i} style={{margin: "8px 0"}}>✓ {item}</p>
                    ))}
                  </div>

                  <div style={mealCard}>
                    <h3 style={{color: "#00695c", margin: "0 0 15px 0"}}>☀️ Lunch</h3>
                    {["Mixed green salad with protein", "Whole grain wrap with vegetables", "Soup with whole grain bread", "Quinoa bowl with mixed vegetables"].map((item, i) => (
                      <p key={i} style={{margin: "8px 0"}}>✓ {item}</p>
                    ))}
                  </div>

                  <div style={mealCard}>
                    <h3 style={{color: "#00695c", margin: "0 0 15px 0"}}>🌙 Dinner</h3>
                    {["Grilled fish with brown rice", "Stir-fried vegetables with tofu", "Lean meat with sweet potato", "Whole wheat pasta with vegetables"].map((item, i) => (
                      <p key={i} style={{margin: "8px 0"}}>✓ {item}</p>
                    ))}
                  </div>

                  <div style={mealCard}>
                    <h3 style={{color: "#00695c", margin: "0 0 15px 0"}}>🍎 Snacks</h3>
                    {["Greek yogurt", "Fresh fruit", "Nuts and seeds", "Vegetable sticks with dip"].map((item, i) => (
                      <p key={i} style={{margin: "8px 0"}}>✓ {item}</p>
                    ))}
                  </div>
                </div>

                <div style={{background: "#e0f2f1", padding: "25px", borderRadius: "12px", border: "2px solid #00695c"}}>
                  <h3 style={{color: "#00695c", marginTop: 0}}>💪 General Health Tips</h3>
                  <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px"}}>
                    {["✅ Balanced macronutrients: 45-50% carbs, 25-30% protein, 20-25% fat", "✅ Include 5+ servings of fruits and vegetables daily", "✅ Choose whole grains over refined grains", "✅ Stay active with regular exercise", "✅ Practice stress management techniques", "✅ Get adequate sleep (7-8 hours nightly)", "✅ Regular health check-ups", "✅ Stay consistent with your routine"].map((tip, i) => (
                      <p key={i} style={{margin: "8px 0", color: "#00695c"}}>{tip}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 2: Custom Diet Plan */}
        {mode === "custom" && (
          <div style={{background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)"}}>
            <h2 style={{color: "#ff4d8d", textAlign: "center"}}>⚙️ Create Your Custom Diet Plan</h2>

            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "25px"}}>
              <input name="age" type="number" placeholder="Age (years)" onChange={handleChange} style={inputStyle} min="1" max="100" />
              <input name="weight" type="number" placeholder="Weight (kg)" onChange={handleChange} style={inputStyle} step="0.1" />
              <input name="height" type="number" placeholder="Height (cm)" onChange={handleChange} style={inputStyle} />
              
              <select name="goal" onChange={handleChange} style={inputStyle} value={form.goal}>
                <option value="maintenance">Goal: Maintenance</option>
                <option value="weight_loss">Goal: Weight Loss</option>
                <option value="weight_gain">Goal: Weight Gain</option>
              </select>

              <select name="activity" onChange={handleChange} style={inputStyle} value={form.activity}>
                <option value="sedentary">Activity: Sedentary</option>
                <option value="light">Activity: Light</option>
                <option value="moderate">Activity: Moderate</option>
                <option value="active">Activity: Active</option>
              </select>

              <input name="restrictions" placeholder="Dietary restrictions (e.g., vegetarian)" onChange={handleChange} style={inputStyle} />
            </div>

            <button onClick={generateDiet} style={{width: "100%", padding: "14px", background: "linear-gradient(135deg, #ff4d8d, #ff8ba0)", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: "pointer"}}>
              🎯 Generate My Diet Plan
            </button>

            {diet && (
              <div style={{marginTop: "30px"}}>
                <h3 style={{color: "#ff4d8d", textAlign: "center"}}>🍽️ Your Personalized Diet Plan</h3>

                <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px"}}>
                  <div style={mealCard}>
                    <h4 style={{color: "#ff6f00", margin: "0 0 15px 0"}}>🌅 Breakfast Options</h4>
                    {diet.breakfast.map((item, i) => <p key={i} style={{margin: "8px 0"}}>• {item}</p>)}
                  </div>

                  <div style={mealCard}>
                    <h4 style={{color: "#ff6f00", margin: "0 0 15px 0"}}>☀️ Lunch Options</h4>
                    {diet.lunch.map((item, i) => <p key={i} style={{margin: "8px 0"}}>• {item}</p>)}
                  </div>

                  <div style={mealCard}>
                    <h4 style={{color: "#ff6f00", margin: "0 0 15px 0"}}>🌙 Dinner Options</h4>
                    {diet.dinner.map((item, i) => <p key={i} style={{margin: "8px 0"}}>• {item}</p>)}
                  </div>

                  <div style={mealCard}>
                    <h4 style={{color: "#ff6f00", margin: "0 0 15px 0"}}>🍎 Snacks & Beverages</h4>
                    {diet.snacks.map((item, i) => <p key={i} style={{margin: "8px 0"}}>• {item}</p>)}
                  </div>
                </div>

                <div style={{background: "#f3e5f5", padding: "25px", borderRadius: "12px", border: "2px solid #7b1fa2"}}>
                  <h4 style={{color: "#7b1fa2", marginTop: 0}}>💡 Your Health Tips</h4>
                  <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px"}}>
                    {diet.tips.map((tip, i) => <p key={i} style={{margin: "8px 0", color: "#6a1b9a"}}>✅ {tip}</p>)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 3: General Guide */}
        {mode === "default" && (
          <div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "40px"}}>
              <div style={{...guidCard, background: "linear-gradient(135deg, #FFE5B4 0%, #FFC87A 100%)"}}>
                <h3>🌅 Breakfast Ideas</h3>
                {["Oatmeal with berries & nuts", "Greek yogurt with honey", "Whole grain toast with avocado", "Green smoothie", "Scrambled eggs with vegetables"].map((item, i) => (
                  <p key={i} style={{margin: "6px 0"}}>• {item}</p>
                ))}
              </div>

              <div style={{...guidCard, background: "linear-gradient(135deg, #B4E7FF 0%, #7AC8FF 100%)"}}>
                <h3>☀️ Lunch Ideas</h3>
                {["Grilled chicken salad", "Vegetable stir-fry with tofu", "Lentil soup", "Quinoa bowl", "Turkey wrap"].map((item, i) => (
                  <p key={i} style={{margin: "6px 0"}}>• {item}</p>
                ))}
              </div>

              <div style={{...guidCard, background: "linear-gradient(135deg, #D4B4FF 0%, #A087FF 100%)"}}>
                <h3>🌙 Dinner Ideas</h3>
                {["Baked salmon with rice", "Lean meat with vegetables", "Pasta with vegetables", "Vegetable curry", "Grilled fish with sweet potato"].map((item, i) => (
                  <p key={i} style={{margin: "6px 0"}}>• {item}</p>
                ))}
              </div>

              <div style={{...guidCard, background: "linear-gradient(135deg, #B4FFB4 0%, #7AFF7A 100%)"}}>
                <h3>✅ PCOS Friendly Foods</h3>
                {["🥬 Spinach & leafy greens", "🥑 Avocado", "🍓 Berries", "🥜 Almonds", "🐟 Fatty fish"].map((item, i) => (
                  <p key={i} style={{margin: "6px 0"}}>{item}</p>
                ))}
              </div>

              <div style={{...guidCard, background: "linear-gradient(135deg, #FFB4B4 0%, #FF7A7A 100%)"}}>
                <h3>❌ Foods To Limit</h3>
                {["🍟 Fried foods", "🍩 Sugary desserts", "🥤 Soft drinks", "🍔 Fast food", "🍞 White bread"].map((item, i) => (
                  <p key={i} style={{margin: "6px 0"}}>{item}</p>
                ))}
              </div>

              <div style={{...guidCard, background: "linear-gradient(135deg, #FFFFB4 0%, #FFFF7A 100%)"}}>
                <h3>💧 Daily Habits</h3>
                {["💧 Drink 8-10 glasses of water", "🏃 Exercise 30+ minutes", "😴 Sleep 7-8 hours", "🧘 Manage stress", "⏱️ Eat on schedule"].map((item, i) => (
                  <p key={i} style={{margin: "6px 0"}}>{item}</p>
                ))}
              </div>
            </div>

            <div style={{background: "linear-gradient(135deg, #fff9e6 0%, #fff0cc 100%)", padding: "30px", borderRadius: "12px", border: "3px solid #fbc02d", textAlign: "center"}}>
              <h2 style={{color: "#f57f17", margin: "0 0 15px 0"}}>📚 Nutrition & Health Tips</h2>
              <p style={{color: "#666", marginBottom: "20px"}}>Follow these guidelines for optimal health and hormonal balance</p>
              
              <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", textAlign: "left"}}>
                <div style={{background: "white", padding: "15px", borderRadius: "8px"}}>
                  <strong>🥗 Balanced Meals</strong><br/>
                  Include proteins, whole grains, and vegetables in every meal
                </div>
                <div style={{background: "white", padding: "15px", borderRadius: "8px"}}>
                  <strong>🎯 Portion Control</strong><br/>
                  Use smaller plates and eat slowly to prevent overeating
                </div>
                <div style={{background: "white", padding: "15px", borderRadius: "8px"}}>
                  <strong>⏰ Regular Timing</strong><br/>
                  Eat meals at consistent times to regulate blood sugar
                </div>
                <div style={{background: "white", padding: "15px", borderRadius: "8px"}}>
                  <strong>🚫 Skip Crash Diets</strong><br/>
                  Focus on sustainable, long-term healthy habits
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const modeBtn = {
  padding: "12px 25px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "bold",
  transition: "all 0.3s",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};

const mealCard = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  border: "1px solid #f0f0f0",
  lineHeight: "1.6"
};

const guidCard = {
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  color: "#333"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "14px",
  boxSizing: "border-box",
  fontFamily: "inherit"
};

export default NutritionPage;