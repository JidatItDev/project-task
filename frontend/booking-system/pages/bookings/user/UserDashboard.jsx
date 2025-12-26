import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserBookings } from "../../services/booking.service";
import "../../pages.css";

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  console.log("User data from localStorage:", user); 
  const userId = user?.id;
  console.log("User ID from localStorage:", userId); 

  useEffect(() => {
    if (!userId) {
      console.log("No userId found, cannot fetch bookings.");
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await getUserBookings(userId);
        console.log("Bookings data:", res.data); 
        setBookings(res.data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  if (!userId) {
    return (
      <div>
        <p>Error: User is not logged in. Please log in again.</p>
        <Link to="/login">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="user-container">
      <div className="user-header">
        <h2>My Bookings</h2>
        <Link to="/user/createBooking" className="btn">
          + Add Booking
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="booking-table">
          <thead>
            <tr>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Notes</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{new Date(b.startTime).toLocaleString()}</td>
                <td>{new Date(b.endTime).toLocaleString()}</td>
                <td>{b.notes || "-"}</td>
                <td className={`status ${b.status}`}>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserDashboard;
