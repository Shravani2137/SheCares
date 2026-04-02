import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

function ReportPage(){
  const { currentUser } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const data = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .sort((a, b) => {
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
    return <div style={{textAlign:"center", marginTop:"150px", fontSize: "20px", color: "#ff4d8d"}}>⏳ Loading your health report...</div>;
  }

  if (error) {
    return (
      <div style={{minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <div style={{textAlign:"center", padding:"50px", background: "white", borderRadius: "12px", maxWidth: "400px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)"}}>
          <h2 style={{color: "#f44336"}}>⚠️ Error Loading Report</h2>
          <p style={{color: "#666", marginBottom: "20px"}}>{error}</p>
          <p style={{fontSize: "1.1em", color: "#666", marginBottom: "30px"}}>Try completing an assessment to generate your health report.</p>
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

  const latestPrediction = predictions.length > 0 ? predictions[0] : null;
  const pcosRiskCount = predictions.filter(p => p.prediction === 1).length;
  const totalPredictions = predictions.length;
  const riskPercentage = totalPredictions > 0 ? ((pcosRiskCount / totalPredictions) * 100).toFixed(1) : 0;

  const generateRecommendations = () => {
    if (!latestPrediction) return [];

    const recs = [];

    if (latestPrediction.prediction === 1) {
      recs.push("⚠️ PCOS Risk Detected - Schedule consultation with gynecologist");
      recs.push("🩺 Regular hormonal blood tests recommended");
      recs.push("🏃‍♀️ Start moderate exercise routine (30 mins daily)");
      recs.push("🥗 Follow anti-inflammatory diet plan");
      recs.push("💊 Consider supplements: Myo-inositol, Vitamin D, Omega-3");

      if (latestPrediction.irregular === "1") {
        recs.push("📅 Track menstrual cycles for 3-6 months");
      }
      if (latestPrediction.hair === "1") {
        recs.push("💄 Consult dermatologist for hirsutism management");
      }
      if (latestPrediction.skin === "1") {
        recs.push("🧴 Use gentle skincare products for acne");
      }
    } else {
      recs.push("✅ Low PCOS risk - Maintain healthy lifestyle");
      recs.push("🏃‍♀️ Continue regular physical activity");
      recs.push("🥗 Keep balanced nutrition habits");
      recs.push("📅 Annual gynecological check-ups");
    }

    // Common recommendations
    recs.push("😴 Aim for 7-8 hours of quality sleep");
    recs.push("💧 Stay hydrated (8-10 glasses of water daily)");
    recs.push("🧘 Practice stress management techniques");
    recs.push("⚖️ Maintain healthy BMI through diet and exercise");

    return recs;
  };

  const recommendations = generateRecommendations();

  return(
    <div style={{padding:"40px", maxWidth:"1000px", margin:"0 auto"}}>

      <h1 style={{textAlign:"center", color:"#ff4d8d", marginBottom:"30px"}}>📊 Health Analysis Report</h1>

      {predictions.length === 0 ? (
        <div style={{textAlign:"center", padding:"50px"}}>
          <h3>No health data available</h3>
          <p>Complete a PCOS assessment to generate your health report.</p>
        </div>
      ) : (
        <div>

          {/* Summary Cards */}
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:"20px", marginBottom:"40px"}}>

            <div style={summaryCard}>
              <h3>Total Assessments</h3>
              <p style={{fontSize:"2em", color:"#ff4d8d"}}>{totalPredictions}</p>
            </div>

            <div style={summaryCard}>
              <h3>PCOS Risk Percentage</h3>
              <p style={{fontSize:"2em", color: riskPercentage > 50 ? "#ff4d8d" : "#4CAF50"}}>{riskPercentage}%</p>
            </div>

            <div style={summaryCard}>
              <h3>Latest Result</h3>
              <p style={{fontSize:"1.5em", color: latestPrediction?.prediction === 1 ? "#ff4d8d" : "#4CAF50"}}>
                {latestPrediction?.prediction === 1 ? "⚠️ At Risk" : "✅ Low Risk"}
              </p>
            </div>

            <div style={summaryCard}>
              <h3>Assessment Date</h3>
              <p>{latestPrediction ? (typeof latestPrediction.createdAt === 'object' && latestPrediction.createdAt.seconds ? new Date(latestPrediction.createdAt.seconds * 1000).toLocaleDateString() : new Date(latestPrediction.createdAt).toLocaleDateString()) : "N/A"}</p>
            </div>

          </div>

          {/* Health Analysis */}
          <div style={analysisSection}>
            <h2>🔍 Health Analysis</h2>

            {latestPrediction && (
              <div style={{marginTop:"20px"}}>

                <h3>Risk Factors Identified:</h3>
                <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:"10px", marginTop:"15px"}}>

                  {latestPrediction.irregular === "1" && (
                    <div style={riskFactor}>📅 Irregular Cycles</div>
                  )}
                  {latestPrediction.weight === "1" && (
                    <div style={riskFactor}>⚖️ Weight Gain</div>
                  )}
                  {latestPrediction.hair === "1" && (
                    <div style={riskFactor}>💇‍♀️ Excess Hair Growth</div>
                  )}
                  {latestPrediction.pimples === "1" && (
                    <div style={riskFactor}>🧴 Acne/Pimples</div>
                  )}
                  {latestPrediction.skin === "1" && (
                    <div style={riskFactor}>🌑 Skin Darkening</div>
                  )}
                  {latestPrediction.fastfood === "1" && (
                    <div style={riskFactor}>🍔 Fast Food Habits</div>
                  )}
                  {latestPrediction.exercise === "0" && (
                    <div style={riskFactor}>🏃‍♀️ Low Exercise</div>
                  )}

                </div>

                <h3 style={{marginTop:"30px"}}>Key Health Metrics:</h3>
                <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:"15px", marginTop:"15px"}}>

                  <div style={metricCard}>
                    <strong>Age:</strong> {latestPrediction.age} years
                  </div>
                  <div style={metricCard}>
                    <strong>BMI:</strong> {latestPrediction.bmi}
                  </div>
                  <div style={metricCard}>
                    <strong>Cycle Length:</strong> {latestPrediction.cycle} days
                  </div>
                  <div style={metricCard}>
                    <strong>Exercise Level:</strong> {latestPrediction.exercise === "1" ? "Regular" : "Irregular"}
                  </div>

                </div>

              </div>
            )}
          </div>

          {/* Recommendations */}
          <div style={recommendationsSection}>
            <h2>💡 Personalized Recommendations</h2>

            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:"15px", marginTop:"20px"}}>

              {recommendations.map((rec, index) => (
                <div key={index} style={recommendationCard}>
                  {rec}
                </div>
              ))}

            </div>
          </div>

          {/* Trend Analysis */}
          {predictions.length > 1 && (
            <div style={analysisSection}>
              <h2>📈 Health Trend Analysis</h2>
              <p>You've completed {totalPredictions} assessments. {pcosRiskCount > 0 ? `PCOS risk was detected in ${pcosRiskCount} of your assessments.` : "No PCOS risk detected in your assessments."}</p>
              <p style={{marginTop:"15px", fontStyle:"italic"}}>💡 Regular monitoring helps track changes in your health status over time.</p>
            </div>
          )}

        </div>
      )}

    </div>
  )
}

const summaryCard = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  textAlign: "center",
  border: "1px solid #f0f0f0"
}

const analysisSection = {
  background: "#f8f9fa",
  padding: "25px",
  borderRadius: "12px",
  marginBottom: "30px",
  border: "1px solid #e9ecef"
}

const recommendationsSection = {
  background: "#e8f4fd",
  padding: "25px",
  borderRadius: "12px",
  marginBottom: "30px",
  border: "1px solid #b3d9ff"
}

const riskFactor = {
  background: "#ffebee",
  padding: "8px 12px",
  borderRadius: "6px",
  fontSize: "14px",
  color: "#c62828",
  textAlign: "center"
}

const metricCard = {
  background: "white",
  padding: "15px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  border: "1px solid #f0f0f0"
}

const recommendationCard = {
  background: "white",
  padding: "15px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  border: "1px solid #e3f2fd",
  borderLeft: "4px solid #2196F3"
}

export default ReportPage