import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function NutritionPage() {

const [mode, setMode] = useState("default"); 
const [prediction, setPrediction] = useState(null);

const [form, setForm] = useState({
  age: "",
  weight: "",
  goal: ""
});

const [diet, setDiet] = useState("");

// 🔥 Fetch latest prediction from Firebase
useEffect(() => {
  const fetchPrediction = async () => {
    const snapshot = await getDocs(collection(db, "predictions"));
    const data = snapshot.docs.map(doc => doc.data());
    const last = data[data.length - 1];
    setPrediction(last?.prediction);
  };
  fetchPrediction();
}, []);

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

// 🔥 Custom diet generator
const generateDiet = () => {
  if (form.goal === "weight loss") {
    setDiet("🥗 Eat low-carb meals, avoid sugar, increase vegetables and protein.");
  } else {
    setDiet("🍱 Balanced diet with proteins, carbs, and healthy fats.");
  }
};

return(

<div style={{padding:"60px",textAlign:"center"}}>

<h1 style={{color:"#ff4d8d"}}>🥗 Nutrition Recommendation</h1>

<p>Personalized diet suggestions for women's hormonal health</p>


{/* 🔥 NEW BUTTONS */}

<div style={{marginTop:"30px"}}>
<button onClick={()=>setMode("prediction")} style={btn}>
Diet Based on Prediction
</button>

<button onClick={()=>setMode("custom")} style={btn}>
Suggest Me a Diet
</button>
</div>


{/* 🔥 MODE 1: PREDICTION BASED */}

{mode==="prediction" && (
<div style={{marginTop:"40px"}}>
<h2>Diet Based on Your Prediction</h2>

{prediction===1 ? (
<div>
<h3>⚠️ PCOS Diet Plan</h3>
<p>Breakfast: Oats + seeds + green tea</p>
<p>Lunch: Brown rice + vegetables + protein</p>
<p>Dinner: Salad + soup</p>
</div>
) : (
<div>
<h3>✅ Healthy Diet Plan</h3>
<p>Balanced meals with fruits and vegetables</p>
<p>Maintain regular exercise</p>
</div>
)}
</div>
)}


{/* 🔥 MODE 2: CUSTOM DIET */}

{mode==="custom" && (
<div style={{marginTop:"40px"}}>
<h2>Custom Diet Plan</h2>

<input name="age" placeholder="Age" onChange={handleChange}/>
<input name="weight" placeholder="Weight" onChange={handleChange}/>
<input name="goal" placeholder="Goal (weight loss/gain)" onChange={handleChange}/>

<br/><br/>

<button onClick={generateDiet} style={btn}>Generate Diet</button>

<p style={{marginTop:"20px"}}>{diet}</p>

</div>
)}


{/* 🔥 DEFAULT (YOUR ORIGINAL UI) */}

{mode==="default" && (

<>

{/* DAILY MEAL PLAN */}

<h2 style={{marginTop:"50px",color:"#ff4d8d"}}>Sample Daily Meal Plan</h2>

<div style={{
display:"flex",
justifyContent:"center",
gap:"30px",
flexWrap:"wrap",
marginTop:"30px"
}}>

<div style={card}>
<h3>🌅 Breakfast</h3>
<p>Oatmeal with berries</p>
<p>Boiled eggs</p>
<p>Green tea</p>
</div>

<div style={card}>
<h3>☀️ Lunch</h3>
<p>Grilled chicken / tofu</p>
<p>Brown rice</p>
<p>Mixed vegetable salad</p>
</div>

<div style={card}>
<h3>🌙 Dinner</h3>
<p>Quinoa or roti</p>
<p>Steamed vegetables</p>
<p>Lentil soup</p>
</div>

</div>


{/* PCOS FRIENDLY FOODS */}

<h2 style={{marginTop:"60px",color:"#ff4d8d"}}>PCOS Friendly Foods</h2>

<div style={{
display:"flex",
justifyContent:"center",
gap:"25px",
flexWrap:"wrap",
marginTop:"30px"
}}>

<div style={food}>🥬 Spinach</div>
<div style={food}>🥑 Avocado</div>
<div style={food}>🍓 Berries</div>
<div style={food}>🥜 Almonds</div>
<div style={food}>🥗 Leafy Greens</div>

</div>


{/* FOODS TO AVOID */}

<h2 style={{marginTop:"60px",color:"#ff4d8d"}}>Foods To Avoid</h2>

<div style={{
display:"flex",
justifyContent:"center",
gap:"25px",
flexWrap:"wrap",
marginTop:"30px"
}}>

<div style={avoid}>🍟 Fried Food</div>
<div style={avoid}>🍩 Sugary Desserts</div>
<div style={avoid}>🥤 Soft Drinks</div>
<div style={avoid}>🍔 Fast Food</div>

</div>


{/* HEALTH TIPS */}

<h2 style={{marginTop:"60px",color:"#ff4d8d"}}>Healthy Lifestyle Tips</h2>

<div style={{
display:"flex",
justifyContent:"center",
gap:"25px",
flexWrap:"wrap",
marginTop:"30px"
}}>

<div style={tip}>💧 Drink 2–3 liters of water daily</div>
<div style={tip}>🏃‍♀️ Exercise at least 30 minutes</div>
<div style={tip}>😴 Sleep 7–8 hours regularly</div>
<div style={tip}>🧘 Practice yoga or meditation</div>

</div>

</>

)}

</div>
)
}


/* STYLES */

const btn={
margin:"10px",
padding:"10px 20px",
background:"#ff4d8d",
color:"white",
border:"none",
borderRadius:"8px",
cursor:"pointer"
}

const card={
background:"white",
padding:"25px",
borderRadius:"12px",
width:"220px",
boxShadow:"0 8px 20px rgba(0,0,0,0.1)"
}

const food={
background:"#e8fff0",
padding:"15px",
borderRadius:"10px",
width:"150px"
}

const avoid={
background:"#ffe5e5",
padding:"15px",
borderRadius:"10px",
width:"150px"
}

const tip={
background:"white",
padding:"20px",
borderRadius:"10px",
width:"200px",
boxShadow:"0 5px 15px rgba(0,0,0,0.1)"
}

export default NutritionPage;