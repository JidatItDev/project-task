import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminBookingsCalendar from "../../../components/layout/AdminBookingsCalendar";
import { adminGetAllBookings } from "../../services/booking.service";

const AdminBookingsCalendarPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchBookings = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await adminGetAllBookings();
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setBookings(data);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const title = useMemo(() => `Bookings Calendar`, []);

  if (loading) return <p style={{ padding: 16 }}>Loading calendar…</p>;

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <button onClick={fetchBookings} style={{ padding: "8px 12px", cursor: "pointer" }}>
          Refresh
        </button>
        <button
          onClick={() => navigate("/admin/dashboard")}
          style={{ padding: "8px 12px", cursor: "pointer" }}
        >
          Go to List
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <AdminBookingsCalendar
        bookings={bookings}
        onDateSelect={(yyyyMmDd) => {
          navigate(`/admin/bookings?date=${encodeURIComponent(yyyyMmDd)}`);
        }}
        // onEventSelect={(booking) => {
        //   const start = booking.startTime || booking.start || booking.date;
        //   const day = start ? String(start).slice(0, 10) : "";
        //   navigate(`/admin/bookings${day ? `?date=${encodeURIComponent(day)}` : ""}`);
        // }}
      />
    </div>
  );
};  

export default AdminBookingsCalendarPage;
