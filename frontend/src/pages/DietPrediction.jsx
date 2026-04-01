import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function DietPrediction() {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const fetchLastPrediction = async () => {
      const snapshot = await getDocs(collection(db, "predictions"));
      const data = snapshot.docs.map(doc => doc.data());

      const last = data[data.length - 1];
      setPrediction(last?.prediction);
    };

    fetchLastPrediction();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Diet Plan</h2>

      {prediction === 1 ? (
        <div>
          <h3>⚠️ PCOS Diet Plan</h3>
          <ul>
            <li>Breakfast: Oats + fruits</li>
            <li>Lunch: Brown rice + vegetables</li>
            <li>Dinner: Salad + protein</li>
          </ul>
        </div>
      ) : (
        <div>
          <h3>✅ Healthy Diet Plan</h3>
          <ul>
            <li>Balanced meals</li>
            <li>Regular exercise</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default DietPrediction;