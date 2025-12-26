import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import CreateBooking from "../pages/bookings/user/CreateBooking";
import UserDashboard from "../pages/bookings/user/UserDashboard";
import AdminDashboard from "../pages/bookings/admin/adminDashboard"; 
import AdminBookingsCalendarPage from "../pages/bookings/admin/AdminBookingsCalendarPage";
import UsersListPage from "../pages/bookings/admin/UsersListPage";

import ProtectedRoute from "../src/routes/ProtectedRoute";
import RoleRoute from "../src/routes/RoleRoute";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="user">
              <UserDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/createBooking"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="user">
              <CreateBooking />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      
      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="admin">
              <AdminDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/AdminBookingsCalendarPage"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="admin">
              <AdminBookingsCalendarPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/UsersListPage"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="admin">
              <UsersListPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
