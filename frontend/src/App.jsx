import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import PCOSPrediction from "./pages/PCOSPrediction";
import NutritionPage from "./pages/NutritionPage";
import Dashboard from "./pages/Dashboard";
import ReportPage from "./pages/ReportPage";

function App(){

return(

<BrowserRouter>

<Navbar/>

<Routes>

<Route path="/" element={<Home/>} />

<Route path="/pcos" element={<PCOSPrediction/>} />

<Route path="/nutrition" element={<NutritionPage/>} />

<Route path="/dashboard" element={<Dashboard/>} />

<Route path="/report" element={<ReportPage/>} />

</Routes>

</BrowserRouter>

)

}

export default App