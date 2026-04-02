import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

function HistoryPage() {
  const { currentUser } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      const q = query(
        collection(db, "predictions"),
        where("userId", "==", currentUser.uid)
      );

      const querySnapshot = await getDocs(q);

      const list = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setData(list);
    };

    fetchData();
  }, [currentUser]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Prediction History</h2>

      {data.map((item) => (
        <div key={item.id} style={{
          border: "1px solid #ccc",
          padding: "10px",
          margin: "10px 0",
          borderRadius: "8px"
        }}>
          <p><b>Age:</b> {item.age}</p>
          <p><b>BMI:</b> {item.bmi}</p>
          <p><b>Result:</b> {item.prediction === 1 ? "⚠️ PCOS Risk" : "✅ Low Risk"}</p>
          <p><b>Date:</b> {new Date(item.createdAt.seconds * 1000).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default HistoryPage;