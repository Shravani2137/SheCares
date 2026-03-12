import { Link } from "react-router-dom";

function Navbar(){

return(

<div style={{
display:"flex",
justifyContent:"space-between",
padding:"15px 40px",
background:"#ff4d8d",
color:"white"
}}>

<h2>SHECARES 🌸</h2>

<div style={{display:"flex",gap:"20px"}}>

<Link to="/" style={{color:"white"}}>Home</Link>
<Link to="/pcos" style={{color:"white"}}>PCOS Check</Link>
<Link to="/nutrition" style={{color:"white"}}>Nutrition</Link>
<Link to="/dashboard" style={{color:"white"}}>Dashboard</Link>
<Link to="/report" style={{color:"white"}}>Report</Link>

</div>

</div>

)

}

export default Navbar