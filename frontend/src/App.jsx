import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import PCOSPrediction from "./pages/PCOSPrediction";
import NutritionPage from "./pages/NutritionPage";
import Dashboard from "./pages/Dashboard";
import ReportPage from "./pages/ReportPage";
import HistoryPage from "./pages/HistoryPage";
import DietPrediction from "./pages/DietPrediction";
import DietCustom from "./pages/DietCustom";

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

<Route path="/history" element={<HistoryPage/>} />

<Route path="/diet-prediction" element={<DietPrediction />} />
<Route path="/diet-custom" element={<DietCustom />} />

</Routes>

</BrowserRouter>

)

}

export default App