import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import CreateBooking from "../pages/bookings/user/CreateBooking";
import UserDashboard from "../pages/bookings/user/UserDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/user/create-booking" element={<CreateBooking />} />      
    </Routes>
  );
}

export default App;

