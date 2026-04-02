import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

function Dashboard(){
  const { currentUser } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "predictions"),
          where("userId", "==", currentUser.uid)
        );

        const snapshot = await getDocs(q);
        let data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Sort by date in JavaScript (descending)
        data.sort((a, b) => {
          const dateA = a.createdAt ? (typeof a.createdAt === 'object' && a.createdAt.seconds ? a.createdAt.seconds : new Date(a.createdAt).getTime() / 1000) : 0;
          const dateB = b.createdAt ? (typeof b.createdAt === 'object' && b.createdAt.seconds ? b.createdAt.seconds : new Date(b.createdAt).getTime() / 1000) : 0;
          return dateB - dateA;
        });

        setPredictions(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching predictions:", err);
        setError(err.message);
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  if (loading) {
    return <div style={{textAlign:"center", marginTop:"150px", fontSize: "20px", color: "#ff4d8d"}}>⏳ Loading your dashboard...</div>;
  }

  if (error) {
    return (
      <div style={{minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <div style={{textAlign:"center", padding:"50px", background: "white", borderRadius: "12px", maxWidth: "400px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)"}}>
          <h2 style={{color: "#f44336"}}>⚠️ Error Loading Dashboard</h2>
          <p style={{color: "#666", marginBottom: "20px"}}>{error}</p>
          <p style={{fontSize: "1.1em", color: "#666", marginBottom: "30px"}}>Try completing an assessment to populate your dashboard.</p>
          <a href="/pcos" style={{
            display: "inline-block",
            padding: "15px 40px",
            background: "#ff4d8d",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "1.1em",
            fontWeight: "bold"
          }}>
            🩺 Take PCOS Assessment
          </a>
        </div>
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div style={{minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <div style={{textAlign:"center", padding:"50px"}}>
          <h2 style={{color: "#ff4d8d", fontSize: "2em"}}>👋 Welcome to Your Health Dashboard!</h2>
          <p style={{fontSize: "1.1em", color: "#666", marginBottom: "30px"}}>You haven't completed any assessments yet.</p>
          <a href="/pcos" style={{
            display: "inline-block",
            padding: "15px 40px",
            background: "#ff4d8d",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "1.1em",
            fontWeight: "bold"
          }}>
            🩺 Start Your First Assessment
          </a>
        </div>
      </div>
    );
  }

  const latestPrediction = predictions[0];
  const pcosRiskCount = predictions.filter(p => p.prediction === 1).length;
  const totalPredictions = predictions.length;
  const riskPercentage = totalPredictions > 0 ? ((pcosRiskCount / totalPredictions) * 100).toFixed(1) : 0;

  // Calculate comprehensive health score
  const calculateHealthScore = () => {
    if (!latestPrediction) return 0;
    let score = 100;

    if (latestPrediction.prediction === 1) score -= 30;
    if (latestPrediction.irregular === "1") score -= 12;
    if (latestPrediction.weight === "1") score -= 10;
    if (latestPrediction.hair === "1") score -= 8;
    if (latestPrediction.pimples === "1") score -= 8;
    if (latestPrediction.skin === "1") score -= 8;
    if (latestPrediction.fastfood === "1") score -= 12;
    if (latestPrediction.exercise === "0") score -= 15;

    if (latestPrediction.exercise === "1") score += 10;
    if (parseFloat(latestPrediction.bmi) >= 18.5 && parseFloat(latestPrediction.bmi) < 25) score += 10;
    if (latestPrediction.probability && latestPrediction.probability < 0.3) score += 5;

    return Math.max(0, Math.min(100, score));
  };

  const healthScore = calculateHealthScore();
  const bmi = parseFloat(latestPrediction.bmi);
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { text: "Underweight", color: "#FF9800" };
    if (bmi < 25) return { text: "Normal", color: "#4CAF50" };
    if (bmi < 30) return { text: "Overweight", color: "#FF9800" };
    return { text: "Obese", color: "#F44336" };
  };

  const bmiCategory = getBMICategory(bmi);
  const riskProbability = latestPrediction.probability ? (latestPrediction.probability * 100).toFixed(1) : (latestPrediction.prediction === 1 ? "70" : "15");

  // Count risk factors
  const countRiskFactors = () => {
    let count = 0;
    if (latestPrediction.irregular === "1") count++;
    if (latestPrediction.weight === "1") count++;
    if (latestPrediction.hair === "1") count++;
    if (latestPrediction.pimples === "1") count++;
    if (latestPrediction.skin === "1") count++;
    if (latestPrediction.fastfood === "1") count++;
    if (latestPrediction.exercise === "0") count++;
    if (bmi > 25) count++;
    return count;
  };

  const riskFactorCount = countRiskFactors();

  const getRecommendations = () => {
    const recs = [];
    if (riskFactorCount > 5) {
      recs.push("🚨 Multiple risk factors detected - Schedule urgent gynecologist consultation");
    }
    if (latestPrediction.irregular === "1") {
      recs.push("📅 Track menstrual cycles - Use health tracking app");
    }
    if (latestPrediction.exercise === "0") {
      recs.push("🏃‍♀️ Start light exercise - Aim for 150 min/week moderate activity");
    }
    if (latestPrediction.fastfood === "1") {
      recs.push("🥗 Reduce fast food - Increase whole foods and fiber intake");
    }
    if (bmi > 25) {
      recs.push("⚖️ Weight management - Target BMI < 25 through balanced diet");
    }
    if (latestPrediction.hair === "1" || latestPrediction.pimples === "1") {
      recs.push("🧴 Dermatologist consultation - For skin and hair symptoms");
    }
    return recs;
  };

  const recommendations = getRecommendations();

  return(
    <div style={{background: "#f5f7fa", minHeight: "100vh"}}>
      <div style={{padding:"40px", maxWidth:"1400px", margin:"0 auto"}}>

        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px"}}>
          <h1 style={{color:"#ff4d8d", margin: 0}}>📊 Health Dashboard</h1>
          <div style={{fontSize: "12px", color: "#999"}}>
            Last Updated: {latestPrediction.createdAt ? (typeof latestPrediction.createdAt === 'object' && latestPrediction.createdAt.seconds ? new Date(latestPrediction.createdAt.seconds * 1000).toLocaleDateString() : new Date(latestPrediction.createdAt).toLocaleDateString()) : 'N/A'}
          </div>
        </div>

        {/* Primary Metrics - Health Score & Risk */}
        <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px"}}>

          {/* Overall Health Score */}
          <div style={{...scoreCard, background: getHealthColor(healthScore)}}>
            <div style={{fontSize: "12px", color: "rgba(255,255,255,0.9)", marginBottom: "10px"}}>OVERALL HEALTH SCORE</div>
            <div style={{fontSize: "3.5em", fontWeight: "bold", color: "white"}}>{healthScore}</div>
            <div style={{fontSize: "14px", color: "rgba(255,255,255,0.9)", marginTop: "5px"}}>out of 100</div>
            <div style={{fontSize: "12px", marginTop: "10px", padding: "8px", background: "rgba(255,255,255,0.2)", borderRadius: "4px", color: "white"}}>
              {getHealthStatus(healthScore)}
            </div>
          </div>

          {/* PCOS Risk Level */}
          <div style={{...scoreCard, background: latestPrediction.prediction === 1 ? "#FF6B6B" : "#51CF66"}}>
            <div style={{fontSize: "12px", color: "rgba(255,255,255,0.9)", marginBottom: "10px"}}>PCOS RISK ASSESSMENT</div>
            <div style={{fontSize: "2.5em", fontWeight: "bold", color: "white"}}>{riskProbability}%</div>
            <div style={{fontSize: "14px", color: "rgba(255,255,255,0.9)", marginTop: "5px"}}>
              {latestPrediction.prediction === 1 ? "High Risk" : "Low Risk"}
            </div>
            <div style={{fontSize: "12px", marginTop: "10px", padding: "8px", background: "rgba(255,255,255,0.2)", borderRadius: "4px", color: "white"}}>
              {riskFactorCount} risk factors identified
            </div>
          </div>

          {/* BMI Indicator */}
          <div style={{...scoreCard, background: bmiCategory.color}}>
            <div style={{fontSize: "12px", color: "rgba(255,255,255,0.9)", marginBottom: "10px"}}>BMI STATUS</div>
            <div style={{fontSize: "2.5em", fontWeight: "bold", color: "white"}}>{bmi.toFixed(1)}</div>
            <div style={{fontSize: "14px", color: "rgba(255,255,255,0.9)", marginTop: "5px"}}>
              {bmiCategory.text}
            </div>
            <div style={{fontSize: "11px", marginTop: "10px", padding: "6px", background: "rgba(255,255,255,0.2)", borderRadius: "4px", color: "white"}}>
              {parseFloat(latestPrediction.height) > 0 && `Height: ${latestPrediction.height}cm`}
            </div>
          </div>

          {/* Assessment Stats */}
          <div style={scoreCard}>
            <div style={{fontSize: "12px", color: "#999", marginBottom: "10px"}}>ASSESSMENT HISTORY</div>
            <div style={{fontSize: "2.5em", fontWeight: "bold", color: "#ff4d8d"}}>{totalPredictions}</div>
            <div style={{fontSize: "14px", color: "#666", marginTop: "5px"}}>
              Total Assessments
            </div>
            <div style={{fontSize: "12px", marginTop: "10px", padding: "8px", background: "#f0f0f0", borderRadius: "4px", color: "#666"}}>
              {pcosRiskCount} showed PCOS risk
            </div>
          </div>

        </div>

        {/* Risk Factor Breakdown */}
        <div style={{background: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: "30px"}}>
          <h2 style={{color: "#ff4d8d", marginTop: 0}}>⚠️ Risk Factor Analysis</h2>
          
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px"}}>
            {[
              { label: "Irregular Cycles", value: latestPrediction.irregular === "1", icon: "📅" },
              { label: "Weight Gain", value: latestPrediction.weight === "1", icon: "⚖️" },
              { label: "Excess Hair", value: latestPrediction.hair === "1", icon: "💇‍♀️" },
              { label: "Acne/Pimples", value: latestPrediction.pimples === "1", icon: "🧴" },
              { label: "Skin Darkening", value: latestPrediction.skin === "1", icon: "🌑" },
              { label: "Fast Food Habits", value: latestPrediction.fastfood === "1", icon: "🍔" },
              { label: "No Exercise", value: latestPrediction.exercise === "0", icon: "🏃" },
              { label: "Elevated BMI", value: bmi > 25, icon: "📊" }
            ].map((factor, i) => (
              <div key={i} style={{
                padding: "12px",
                background: factor.value ? "#ffebee" : "#e8f5e9",
                border: `2px solid ${factor.value ? "#ff6b6b" : "#51cf66"}`,
                borderRadius: "8px",
                textAlign: "center"
              }}>
                <div style={{fontSize: "20px", marginBottom: "5px"}}>{factor.icon}</div>
                <div style={{fontSize: "12px", fontWeight: "bold", color: factor.value ? "#c62828" : "#2e7d32"}}>
                  {factor.value ? "⚠️ Present" : "✅ Absent"}
                </div>
                <div style={{fontSize: "11px", color: "#666", marginTop: "3px"}}>{factor.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div style={{background: "#fff8e1", padding: "25px", borderRadius: "12px", border: "2px solid #fbc02d", marginBottom: "30px"}}>
          <h2 style={{color: "#f57f17", marginTop: 0}}>💡 Personalized Recommendations</h2>
          <div style={{display: "grid", gridTemplateColumns: recommendations.length > 2 ? "1fr 1fr" : "1fr", gap: "15px"}}>
            {recommendations.map((rec, i) => (
              <div key={i} style={{
                padding: "12px",
                background: "white",
                borderRadius: "8px",
                borderLeft: "4px solid #fbc02d"
              }}>
                {rec}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Health Metrics */}
        <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "30px"}}>

          {/* Lifestyle Overview */}
          <div style={{background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"}}>
            <h3 style={{color: "#ff4d8d", marginTop: 0}}>💪 Lifestyle Factors</h3>
            <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
              <div style={metricRow}>
                <span>🏃 Exercise Routine</span>
                <span style={{color: latestPrediction.exercise === "1" ? "#4CAF50" : "#F44336", fontWeight: "bold"}}>
                  {latestPrediction.exercise === "1" ? "✅ Regular" : "❌ Irregular"}
                </span>
              </div>
              <div style={metricRow}>
                <span>🍽️ Diet Quality</span>
                <span style={{color: latestPrediction.fastfood === "1" ? "#F44336" : "#4CAF50", fontWeight: "bold"}}>
                  {latestPrediction.fastfood === "1" ? "⚠️ Needs Improvement" : "✅ Good"}
                </span>
              </div>
              <div style={metricRow}>
                <span>💧 Hydration</span>
                <span style={{color: "#2196F3", fontWeight: "bold"}}>📋 Track Daily</span>
              </div>
            </div>
          </div>

          {/* Symptom Overview */}
          <div style={{background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"}}>
            <h3 style={{color: "#ff4d8d", marginTop: 0}}>🩺 PCOS Symptoms</h3>
            <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
              <div style={metricRow}>
                <span>📅 Menstrual Cycles</span>
                <span style={{color: latestPrediction.irregular === "1" ? "#F44336" : "#4CAF50", fontWeight: "bold"}}>
                  {latestPrediction.irregular === "1" ? "⚠️ Irregular" : "✅ Regular"}
                </span>
              </div>
              <div style={metricRow}>
                <span>💇 Hair Growth</span>
                <span style={{color: latestPrediction.hair === "1" ? "#F44336" : "#4CAF50", fontWeight: "bold"}}>
                  {latestPrediction.hair === "1" ? "⚠️ Excess" : "✅ Normal"}
                </span>
              </div>
              <div style={metricRow}>
                <span>🧴 Skin Condition</span>
                <span style={{color: (latestPrediction.pimples === "1" || latestPrediction.skin === "1") ? "#F44336" : "#4CAF50", fontWeight: "bold"}}>
                  {(latestPrediction.pimples === "1" || latestPrediction.skin === "1") ? "⚠️ Issues" : "✅ Clear"}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Assessments */}
          <div style={{background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"}}>
            <h3 style={{color: "#ff4d8d", marginTop: 0}}>📈 Recent Trend</h3>
            {predictions.slice(0, 3).map((pred, i) => (
              <div key={i} style={metricRow}>
                <span style={{fontSize: "12px"}}>
                  {pred.createdAt ? (typeof pred.createdAt === 'object' && pred.createdAt.seconds ? new Date(pred.createdAt.seconds * 1000).toLocaleDateString() : new Date(pred.createdAt).toLocaleDateString()) : 'N/A'}
                </span>
                <span style={{
                  color: pred.prediction === 1 ? "#F44336" : "#4CAF50",
                  fontWeight: "bold",
                  fontSize: "12px"
                }}>
                  {pred.prediction === 1 ? "⚠️ Risk" : "✅ Low Risk"} ({pred.probability ? (pred.probability * 100).toFixed(0) : 0}%)
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Quick Actions */}
        <div style={{background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "30px", borderRadius: "12px", color: "white"}}>
          <h2 style={{marginTop: 0}}>🚀 Next Steps</h2>
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px"}}>
            <a href="/pcos" style={{...actionBtn, background: "rgba(255,255,255,0.2)"}}>📝 New Assessment</a>
            <a href="/nutrition" style={{...actionBtn, background: "rgba(255,255,255,0.2)"}}>🥗 Diet Plan</a>
            <a href="/report" style={{...actionBtn, background: "rgba(255,255,255,0.2)"}}>📊 Full Report</a>
            <a href="/reminder" style={{...actionBtn, background: "rgba(255,255,255,0.2)"}}>⏰ Set Reminders</a>
          </div>
        </div>

      </div>
    </div>
  )
}

// Helper functions
const getHealthColor = (score) => {
  if (score >= 80) return "#51CF66";
  if (score >= 60) return "#FFD93D";
  if (score >= 40) return "#FF9800";
  return "#FF6B6B";
};

const getHealthStatus = (score) => {
  if (score >= 80) return "🌟 Excellent Health";
  if (score >= 60) return "👍 Good Health";
  if (score >= 40) return "⚠️ Fair Health";
  return "🚨 Critical - Seek Help";
};

// Styles
const scoreCard = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  border: "1px solid #f0f0f0",
  cursor: "pointer",
  transition: "transform 0.2s"
};

const metricRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  borderBottom: "1px solid #f0f0f0"
};

const actionBtn = {
  display: "block",
  padding: "12px 20px",
  borderRadius: "8px",
  textDecoration: "none",
  color: "white",
  textAlign: "center",
  fontWeight: "bold",
  transition: "transform 0.2s",
  border: "1px solid rgba(255,255,255,0.3)"
};

export default Dashboard