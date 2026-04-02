import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

function DietPrediction() {
  const { currentUser } = useAuth();
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const fetchLastPrediction = async () => {
      if (!currentUser) return;

      const q = query(
        collection(db, "predictions"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());
      const last = data[0];
      setPrediction(last?.prediction);
    };

    fetchLastPrediction();
  }, [currentUser]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Diet Plan Based on Your PCOS Assessment</h2>

      {prediction === null ? (
        <p>Loading your personalized diet plan...</p>
      ) : prediction === 1 ? (
        <div>
          <h3>⚠️ PCOS Management Diet Plan</h3>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(250px, 1fr))", gap:"20px", marginTop:"20px"}}>
            <div style={{background:"white", padding:"20px", borderRadius:"10px", boxShadow:"0 4px 15px rgba(0,0,0,0.1)"}}>
              <h4>🌅 Breakfast</h4>
              <ul>
                <li>Steel-cut oats with cinnamon</li>
                <li>Greek yogurt with berries</li>
                <li>Vegetable omelet</li>
              </ul>
            </div>
            <div style={{background:"white", padding:"20px", borderRadius:"10px", boxShadow:"0 4px 15px rgba(0,0,0,0.1)"}}>
              <h4>☀️ Lunch</h4>
              <ul>
                <li>Quinoa salad with chicken</li>
                <li>Lentil soup with vegetables</li>
                <li>Turkey wrap with avocado</li>
              </ul>
            </div>
            <div style={{background:"white", padding:"20px", borderRadius:"10px", boxShadow:"0 4px 15px rgba(0,0,0,0.1)"}}>
              <h4>🌙 Dinner</h4>
              <ul>
                <li>Baked salmon with broccoli</li>
                <li>Tofu stir-fry with greens</li>
                <li>Lean beef with sweet potato</li>
              </ul>
            </div>
          </div>
          <div style={{background:"#ffebee", padding:"20px", borderRadius:"10px", marginTop:"20px"}}>
            <h4>💡 Key Recommendations</h4>
            <ul>
              <li>Limit refined carbohydrates and sugars</li>
              <li>Choose low glycemic index foods</li>
              <li>Include anti-inflammatory foods</li>
              <li>Consider supplements: Inositol, Vitamin D</li>
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <h3>✅ Healthy Maintenance Diet Plan</h3>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(250px, 1fr))", gap:"20px", marginTop:"20px"}}>
            <div style={{background:"white", padding:"20px", borderRadius:"10px", boxShadow:"0 4px 15px rgba(0,0,0,0.1)"}}>
              <h4>🌅 Breakfast</h4>
              <ul>
                <li>Whole grain toast with avocado</li>
                <li>Smoothie with fruits and greens</li>
                <li>Eggs with vegetables</li>
              </ul>
            </div>
            <div style={{background:"white", padding:"20px", borderRadius:"10px", boxShadow:"0 4px 15px rgba(0,0,0,0.1)"}}>
              <h4>☀️ Lunch</h4>
              <ul>
                <li>Mixed green salad with protein</li>
                <li>Whole grain wrap with veggies</li>
                <li>Soup with whole grain bread</li>
              </ul>
            </div>
            <div style={{background:"white", padding:"20px", borderRadius:"10px", boxShadow:"0 4px 15px rgba(0,0,0,0.1)"}}>
              <h4>🌙 Dinner</h4>
              <ul>
                <li>Grilled fish with brown rice</li>
                <li>Stir-fried vegetables with tofu</li>
                <li>Lean meat with sweet potato</li>
              </ul>
            </div>
          </div>
          <div style={{background:"#e8f5e8", padding:"20px", borderRadius:"10px", marginTop:"20px"}}>
            <h4>💡 General Health Tips</h4>
            <ul>
              <li>Maintain balanced macronutrients</li>
              <li>Include variety of colorful vegetables</li>
              <li>Choose whole grains over refined</li>
              <li>Stay active with regular exercise</li>
            </ul>
          </div>
        </div>
      )}

      <div style={{marginTop:"30px", textAlign:"center"}}>
        <a href="/nutrition" style={{color:"#ff4d8d", textDecoration:"none", fontWeight:"bold"}}>← Back to Nutrition Page for Custom Plans</a>
      </div>
    </div>
  );
}

export default DietPrediction;