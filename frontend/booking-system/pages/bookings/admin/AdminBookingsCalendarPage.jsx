import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminBookingsCalendar from "../../../components/layout/AdminBookingsCalendar";
import { adminGetAllBookings } from "../../services/booking.service";
import AdminSidebar from "../../../components/layout/Sidebar";
import UserBookingsModal from "../admin/UserBookingsModal"; 
import { getBookingById } from "../../services/booking.service"; 

const AdminBookingsCalendarPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null); 
  const [bookingDetails, setBookingDetails] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState("");

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

  // Handle booking click from calendar
  const handleBookingClick = (booking) => {
    // Store the clicked booking
    setSelectedBooking(booking);
    // If you need to fetch additional details, fetch them here
    fetchBookingDetails(booking._id || booking.id);
    setModalOpen(true);
  };

  const fetchBookingDetails = async (bookingId) => {
    if (!bookingId) return;
    
    setUserLoading(true);
    setUserError("");
    try {
      // Use your API endpoint for getting a single booking
      const res = await getBookingById(bookingId);
      setBookingDetails(res.data);
    } catch (e) {
      console.error(e);
      setUserError(e.response?.data?.message || "Failed to load booking details");
    } finally {
      setUserLoading(false);
    }
  };

  // Close modal and reset
  const closeModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
    setBookingDetails(null); // Reset booking details
    setUserError("");
    setUserLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const title = useMemo(() => `Bookings Calendar`, []);

  if (loading) return <p style={{ padding: 16 }}>Loading calendar…</p>;

  return (
    <div style={{ 
      display: "flex", 
      minHeight: "100vh", 
      backgroundColor: "#f5f5f5",
      position: "relative" // For modal positioning
    }}>
      <AdminSidebar />
      
      <div style={{ 
        flex: 1, 
        padding: "24px", 
        marginLeft: "250px",
        overflow: "auto",
        transition: "margin-left 0.3s ease"
      }}>
        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto"
        }}>
          {/* Header Section */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between",
            alignItems: "center", 
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "16px"
          }}>
            <h1 style={{ 
              margin: 0, 
              fontSize: "28px", 
              fontWeight: "600",
              color: "#2d3748"
            }}>
              {title}
            </h1>
            
            <div style={{ 
              display: "flex", 
              gap: "12px",
              alignItems: "center" 
            }}>
              <button 
                onClick={fetchBookings} 
                style={{ 
                  padding: "10px 18px", 
                  cursor: "pointer",
                  backgroundColor: "#4299e1",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "500",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 4px rgba(66, 153, 225, 0.2)"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#3182ce"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#4299e1"}
              >
                Refresh Calendar
              </button>
              <button
                onClick={() => navigate("/admin/dashboard")}
                style={{ 
                  padding: "10px 18px", 
                  cursor: "pointer",
                  backgroundColor: "#edf2f7",
                  color: "#4a5568",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontWeight: "500",
                  fontSize: "14px",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#e2e8f0"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#edf2f7"}
              >
                Go to List
              </button>
            </div>
          </div>

          {error && (
            <div style={{ 
              padding: "16px", 
              backgroundColor: "#fed7d7", 
              color: "#c53030",
              borderRadius: "8px",
              marginBottom: "24px",
              border: "1px solid #fc8181"
            }}>
              {error}
            </div>
          )}

          {/* Calendar Container */}
          <div style={{ 
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            padding: "24px",
            overflow: "hidden",
            transition: "transform 0.3s ease",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{ 
              maxWidth: "900px",
              margin: "0 auto",
              transform: "scale(0.95)",
              transformOrigin: "top center"
            }}>
              <AdminBookingsCalendar
                bookings={bookings}
                onDateSelect={(yyyyMmDd) => {
                  navigate(`/admin/bookings?date=${encodeURIComponent(yyyyMmDd)}`);
                }}
                onEventSelect={handleBookingClick}
              />
            </div>
          </div>

          {/* Stats */}
          <div style={{ 
            marginTop: "24px",
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap"
          }}>
            <div style={{
              padding: "12px 20px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              textAlign: "center",
              minWidth: "120px"
            }}>
              <div style={{ fontSize: "12px", color: "#718096" }}>Total Bookings</div>
              <div style={{ fontSize: "24px", fontWeight: "600", color: "#2d3748" }}>
                {bookings.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {modalOpen && (
        <UserBookingsModal
          isOpen={modalOpen}
          onClose={closeModal}
          // Pass either the fetched details or the original booking
          booking={bookingDetails || selectedBooking}
          loading={userLoading}
          error={userError}
        />
      )}
    </div>
  );
};

export default AdminBookingsCalendarPage;