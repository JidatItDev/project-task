import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../../components/layout/Sidebar";


const API_URL = "http://localhost:3001";

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token;
};

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    setError("");
    setLoading(true);

    try {
      const token = getToken();
      const res = await axios.get(`${API_URL}/admin/getAllBookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Expecting array of bookings
      setBookings(Array.isArray(res.data) ? res.data : res.data?.data ?? []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (bookingId, status) => {
    setError("");
    setUpdatingId(bookingId);

    try {
      const token = getToken();

      const res = await axios.put(
        `${API_URL}/admin/updateBookingStatus/${bookingId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId || b._id === bookingId ? { ...b, status } : b))
      );

      console.log("Status updated:", res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update booking status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p style={{ padding: 16 }}>Loading bookings...</p>;

  return (
  <div className="admin-layout">
    {/* Sidebar */}
    <AdminSidebar />

    {/* Main Content */}
    <div className="admin-content">
      <div style={{ padding: 16 }}>
        <h2 className="admin-title">All Bookings</h2>

        {error && (
          <p style={{ color: "red", marginBottom: 12 }}>
            {error}
          </p>
        )}

        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>ID</th>
                  <th style={th}>User</th>
                  <th style={th}>Start</th>
                  <th style={th}>End</th>
                  <th style={th}>Notes</th>
                  <th style={th}>Status</th>
                  <th style={th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b) => {
                  const bookingId = b.id ?? b._id;
                  const userLabel =
                    b.user?.name ??
                    b.user?.email ??
                    b.userName ??
                    b.email ??
                    b.userId ??
                    "-";

                  const start = b.startTime
                    ? new Date(b.startTime).toLocaleString()
                    : "-";
                  const end = b.endTime
                    ? new Date(b.endTime).toLocaleString()
                    : "-";

                  return (
                    <tr key={bookingId} style={{ borderTop: "1px solid #eee" }}>
                      <td style={td}>{bookingId}</td>
                      <td style={td}>{userLabel}</td>
                      <td style={td}>{start}</td>
                      <td style={td}>{end}</td>
                      <td style={td}>{b.notes || "-"}</td>
                      <td style={td}>
                        <span style={pillStyle(b.status)}>
                          {b.status}
                        </span>
                      </td>
                      <td style={td}>
                        <select
                          value={b.status || "pending"}
                          disabled={updatingId === bookingId}
                          onChange={(e) =>
                            updateBookingStatus(
                              bookingId,
                              e.target.value
                            )
                          }
                          style={{ padding: 6 }}
                        >
                          <option value="pending">pending</option>
                          <option value="accepted">accepted</option>
                          <option value="rejected">rejected</option>
                        </select>

                        {updatingId === bookingId && (
                          <span
                            style={{
                              marginLeft: 8,
                              fontSize: 12,
                            }}
                          >
                            Updating…
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <button
              onClick={fetchBookings}
              style={{
                marginTop: 12,
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

};

export default AdminDashboard;

const th = {
  textAlign: "left",
  padding: "10px 8px",
  background: "#f6f6f6",
  borderBottom: "1px solid #e6e6e6",
  fontWeight: 600,
};

const td = {
  padding: "10px 8px",
  verticalAlign: "top",
};

const pillStyle = (status) => {
  const s = String(status || "pending").toLowerCase();
  const base = {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    textTransform: "capitalize",
  };

  if (s === "accepted") return { ...base, background: "#e8fff1", color: "#148a3a" };
  if (s === "rejected") return { ...base, background: "#ffecec", color: "#b3261e" };
  return { ...base, background: "#fff8db", color: "#8a6a00" }; // pending
};
