import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import PCOSPrediction from "./pages/PCOSPrediction";
import NutritionPage from "./pages/NutritionPage";
import ReminderPage from "./pages/ReminderPage";
import Dashboard from "./pages/Dashboard";
import ReportPage from "./pages/ReportPage";
import HistoryPage from "./pages/HistoryPage";
import DietPrediction from "./pages/DietPrediction";
import DietCustom from "./pages/DietCustom";

function App(){

return(

<AuthProvider>
<BrowserRouter>

<Navbar/>

<Routes>

<Route path="/" element={<Home/>} />
<Route path="/login" element={<Login/>} />

<Route path="/pcos" element={
  <ProtectedRoute>
    <PCOSPrediction/>
  </ProtectedRoute>
} />

<Route path="/nutrition" element={
  <ProtectedRoute>
    <NutritionPage/>
  </ProtectedRoute>
} />

<Route path="/reminder" element={
  <ProtectedRoute>
    <ReminderPage/>
  </ProtectedRoute>
} />

<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard/>
  </ProtectedRoute>
} />

<Route path="/report" element={
  <ProtectedRoute>
    <ReportPage/>
  </ProtectedRoute>
} />

<Route path="/history" element={
  <ProtectedRoute>
    <HistoryPage/>
  </ProtectedRoute>
} />

<Route path="/diet-prediction" element={
  <ProtectedRoute>
    <DietPrediction />
  </ProtectedRoute>
} />
<Route path="/diet-custom" element={
  <ProtectedRoute>
    <DietCustom />
  </ProtectedRoute>
} />

</Routes>

</BrowserRouter>
</AuthProvider>

)

}

export default App