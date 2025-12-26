import { Link } from "react-router-dom";
import "../../pages/pages.css";

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <h2 className="admin-sidebar-title">Admin Panel</h2>

      <nav className="admin-sidebar-nav">
        <Link to="/admin/UsersListPage" className="admin-sidebar-link">
          Users
        </Link>

        <Link to="/admin/dashboard" className="admin-sidebar-link">
          Booking Requests
        </Link>

        <Link to="/admin/AdminBookingsCalendarPage" className="admin-sidebar-link">
          Calendar
        </Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;
