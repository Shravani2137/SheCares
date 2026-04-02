import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Home(){
  const { currentUser } = useAuth();

  return(

    <div>

{/* HERO SECTION */}

<div style={{
display:"flex",
alignItems:"center",
justifyContent:"space-between",
padding:"140px 150px",
background:"linear-gradient(135deg,#ffe6f0,#ffd6e8)",
flexWrap:"wrap"
}}>

{/* LEFT TEXT */}

<div style={{maxWidth:"500px"}}>

<h1 style={{
fontSize:"55px",
color:"#ff4d8d",
marginBottom:"10px"
}}>
🌸 SHECARES
</h1>

<h2 style={{
fontWeight:"500",
color:"#444",
marginBottom:"20px"
}}>
AI Powered Women's Health & Wellness Platform
</h2>

<p style={{
fontSize:"18px",
color:"#666",
marginBottom:"30px"
}}>
Predict PCOS risk, improve nutrition, track health analytics,
and generate smart health reports using machine learning.
</p>

<div style={{display:"flex",gap:"15px"}}>

{currentUser ? (
  <>
    <Link to="/dashboard">
    <button style={{
    padding:"12px 25px",
    background:"#ff4d8d",
    color:"white",
    border:"none",
    borderRadius:"8px",
    cursor:"pointer"
    }}>
    Go to Dashboard
    </button>
    </Link>

    <Link to="/pcos">
    <button style={{
    padding:"12px 25px",
    background:"white",
    border:"2px solid #ff4d8d",
    color:"#ff4d8d",
    borderRadius:"8px",
    cursor:"pointer"
    }}>
    Take PCOS Test
    </button>
    </Link>
  </>
) : (
  <Link to="/login">
  <button style={{
  padding:"12px 25px",
  background:"#ff4d8d",
  color:"white",
  border:"none",
  borderRadius:"8px",
  cursor:"pointer"
  }}>
  Get Started
  </button>
  </Link>
)}

</div>

<div style={{
display:"flex",
gap:"20px",
marginTop:"30px",
flexWrap:"wrap"
}}>

<div style={badge}>🧠 AI Prediction</div>
<div style={badge}>🥗 Smart Nutrition</div>
<div style={badge}>📊 Health Analytics</div>

</div>

</div>

{/* RIGHT IMAGE */}

<img
src="https://images.unsplash.com/photo-1576091160550-2173dba999ef"
style={{
width:"500px",
borderRadius:"60px",
boxShadow:"0 10px 25px rgba(1,0,0,0.16)"
}}
/>

</div>


{/* WOMEN HEALTH SCROLL SECTION */}

<div style={{
padding:"60px 30px",
background:"#fff5fa"
}}>

<h2 style={{textAlign:"center",color:"#ff4d8d"}}>
Women's Health Insights
</h2>

<div style={{
display:"flex",
overflowX:"auto",
gap:"20px",
padding:"30px",
scrollBehavior:"smooth"
}}>

<div style={scrollCard}>
<img 
src="https://images.unsplash.com/photo-1584515933487-779824d29309"
style={imgStyle}
/>
<h3>PCOS Awareness</h3>
<p>Understand symptoms and early detection of PCOS.</p>
</div>

<div style={scrollCard}>
<img 
src="https://images.unsplash.com/photo-1490645935967-10de6ba17061"
style={imgStyle}
/>
<h3>Healthy Nutrition</h3>
<p>Balanced diet helps regulate hormones.</p>
</div>

<div style={scrollCard}>
<img 
src="https://images.unsplash.com/photo-1518611012118-696072aa579a"
style={imgStyle}
/>
<h3>Daily Exercise</h3>
<p>Regular workouts improve hormonal balance.</p>
</div>

<div style={scrollCard}>
<img 
src="https://images.unsplash.com/photo-1506126613408-eca07ce68773"
style={imgStyle}
/>
<h3>Mental Wellness</h3>
<p>Reduce stress through meditation and mindfulness.</p>
</div>

<div style={scrollCard}>
<img 
src="https://images.unsplash.com/photo-1554284126-aa88f22d8b74"
style={imgStyle}
/>
<h3>Yoga for Hormones</h3>
<p>Yoga practices can help improve reproductive health.</p>
</div>

<div style={scrollCard}>
<img 
src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2"
style={imgStyle}
/>
<h3>Healthy Lifestyle</h3>
<p>Maintain sleep, diet, and exercise routines.</p>
</div>

</div>

</div>


{/* FEATURES */}

<div style={{padding:"70px 40px",textAlign:"center"}}>

<h2 style={{color:"#ff4d8d"}}>Platform Features</h2>

<div style={{
display:"flex",
justifyContent:"center",
gap:"30px",
marginTop:"40px",
flexWrap:"wrap"
}}>

<div style={card}>
<h3>🧠 PCOS Prediction</h3>
<p>ML based system that predicts PCOS risk using health indicators.</p>
</div>

<div style={card}>
<h3>🥗 Nutrition Guide</h3>
<p>Personalized food recommendations for hormone balance.</p>
</div>

<div style={card}>
<h3>📊 Health Dashboard</h3>
<p>Track health patterns using analytics and visual charts.</p>
</div>

<div style={card}>
<h3>📄 Smart Reports</h3>
<p>Generate downloadable health reports.</p>
</div>

</div>

</div>


{/* STATISTICS SECTION */}

<div style={{
background:"#fff0f6",
padding:"70px 40px",
textAlign:"center"
}}>

<h2 style={{color:"#ff4d8d"}}>Women's Health Insights</h2>

<div style={{
display:"flex",
justifyContent:"center",
gap:"50px",
marginTop:"40px",
flexWrap:"wrap"
}}>

<div>
<h1 style={{color:"#ff4d8d"}}>1 in 10</h1>
<p>Women suffer from PCOS globally</p>
</div>

<div>
<h1 style={{color:"#ff4d8d"}}>70%</h1>
<p>Cases remain undiagnosed</p>
</div>

<div>
<h1 style={{color:"#ff4d8d"}}>30%</h1>
<p>Improvement with lifestyle changes</p>
</div>

</div>

</div>


{/* HEALTH TIPS */}

<div style={{padding:"70px 40px",textAlign:"center"}}>

<h2 style={{color:"#ff4d8d"}}>Daily Health Tips</h2>

<div style={{
display:"flex",
justifyContent:"center",
gap:"30px",
marginTop:"40px",
flexWrap:"wrap"
}}>

<div style={tip}>💧 Drink at least 2L water daily</div>
<div style={tip}>🥦 Eat iron rich foods like spinach</div>
<div style={tip}>🏃‍♀️ Exercise 30 minutes daily</div>
<div style={tip}>🧘 Reduce stress with meditation</div>

</div>

</div>


{/* WHY SHECARES */}

<div style={{
background:"#fff0f6",
padding:"70px 40px",
textAlign:"center"
}}>

<h2 style={{color:"#ff4d8d"}}>Why Choose SHECARES?</h2>

<p style={{
maxWidth:"700px",
margin:"auto",
marginTop:"20px",
fontSize:"18px"
}}>
SHECARES integrates machine learning with health monitoring to provide
a comprehensive women wellness platform. Our system helps users detect
PCOS risks early, follow healthier diets, track health analytics,
and generate professional medical-style reports.
</p>

</div>


{/* QUICK ACCESS */}

<div style={{padding:"70px 40px",textAlign:"center"}}>

<h2 style={{color:"#ff4d8d"}}>Quick Access</h2>

<div style={{
display:"flex",
justifyContent:"center",
gap:"30px",
marginTop:"40px",
flexWrap:"wrap"
}}>

<Link to="/pcos">
<button style={navbtn}>PCOS Prediction</button>
</Link>

<Link to="/nutrition">
<button style={navbtn}>Nutrition Guide</button>
</Link>

<Link to="/dashboard">
<button style={navbtn}>Health Dashboard</button>
</Link>

<Link to="/report">
<button style={navbtn}>Health Report</button>
</Link>

</div>

</div>


{/* FOOTER */}

<div style={{
background:"#ff4d8d",
color:"white",
textAlign:"center",
padding:"25px"
}}>

<p>© 2026 SHECARES • Smart Women Healthcare Platform</p>

</div>

</div>

)

}


/* STYLES */

const card = {
width:"250px",
padding:"25px",
background:"white",
borderRadius:"12px",
boxShadow:"0 8px 20px rgba(0,0,0,0.1)"
}

const tip = {
background:"white",
padding:"20px",
borderRadius:"10px",
width:"200px",
boxShadow:"0 5px 15px rgba(0,0,0,0.1)"
}

const navbtn = {
padding:"12px 25px",
background:"#ff4d8d",
color:"white",
border:"none",
borderRadius:"8px",
cursor:"pointer"
}

const scrollCard={
minWidth:"250px",
background:"white",
padding:"15px",
borderRadius:"12px",
boxShadow:"0 6px 15px rgba(0,0,0,0.1)",
textAlign:"center"
}

const imgStyle={
width:"100%",
height:"150px",
objectFit:"cover",
borderRadius:"10px"
}

const badge={
background:"white",
padding:"10px 15px",
borderRadius:"20px",
boxShadow:"0 4px 10px rgba(0,0,0,0.1)",
fontSize:"14px"
}

export default Home