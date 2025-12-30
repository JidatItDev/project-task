import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserBookings } from "../../services/booking.service";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button"; 
import { LogOut } from "lucide-react"; 
import CreateBookingModal from "../user/CreateBookingModal";

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const userEmail = user?.email || user?.userEmail || user?.user?.email || "";

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const fetchBookings = async () => {
    setError("");
    setLoading(true);
    try {
      console.log("Fetching bookings for user ID:", userId); // Debug log
      
      const res = await getUserBookings(userId);
      
      console.log("API Response:", res); 
      console.log("Response data:", res.data); 
      
      let bookingsData = [];
      
      if (Array.isArray(res.data)) {
        bookingsData = res.data;
      } else if (res.data && Array.isArray(res.data.data)) {
        bookingsData = res.data.data;
      } else if (res.data && res.data.bookings && Array.isArray(res.data.bookings)) {
        bookingsData = res.data.bookings;
      } else if (res.data && res.data.data && Array.isArray(res.data.data.bookings)) {
        bookingsData = res.data.data.bookings;
      } else if (res.data && typeof res.data === 'object') {
        if (res.data._id || res.data.id || res.data.startTime) {
          bookingsData = [res.data];
        } else {
          for (const key in res.data) {
            if (Array.isArray(res.data[key])) {
              bookingsData = res.data[key];
              break;
            }
          }
        }
      }
      
      console.log("Processed bookings data:", bookingsData); 
      
      if (!Array.isArray(bookingsData)) {
        console.error("Bookings data is not an array:", bookingsData);
        setError("Invalid data format received from server");
        setBookings([]);
      } else {
        setBookings(bookingsData);
      }
      
    } catch (e) {
      console.error("Error fetching bookings:", e);
      setError(e.response?.data?.message || "Failed to fetch bookings. Please try again.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchBookings();
  }, [userId]);


  if (!userId) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
          <p className="text-lg text-red-600">Error: User is not logged in. Please log in again.</p>
          <Link to="/login" className="text-blue-600 hover:underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusLower = (status || "").toLowerCase();
    switch (statusLower) {
      case "accepted":  
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Accepted
          </span>
        );
      case "rejected": 
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            Rejected
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {status || "Unknown"}
          </span>
        );
    }
  };

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return dateString || "-";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with User Info and Logout */}
        <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-md">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name || user?.userName || "User"}!</h1>
            <p className="text-gray-600">{userEmail}</p>
            <p className="text-sm text-gray-500">User ID: {userId}</p>
            <p className="text-sm text-gray-500">Role: {user?.role || "User"}</p>
          </div>
          
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Dashboard Content */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">My Bookings</h2>
            <CreateBookingModal onCreated={fetchBookings} />
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-500">Loading bookings...</p>
              </div>
            </div>
          ) : !Array.isArray(bookings) || bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block p-4 rounded-full bg-blue-50 mb-4">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
              <p className="text-gray-600 mt-1">Create your first booking to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-separate border-spacing-0">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">#</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Start Time</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">End Time</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Service</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Notes</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, index) => {
                    // Extract booking data safely
                    const booking = b || {};
                    const bookingId = booking._id || booking.id || `booking-${index}`;
                    const serviceName = booking.serviceName || booking.service || "N/A";
                    
                    return (
                      <tr key={bookingId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-center text-gray-600 border-t">{index + 1}</td>
                        <td className="px-4 py-3 border-t">{formatDate(booking.startTime)}</td>
                        <td className="px-4 py-3 border-t">{formatDate(booking.endTime)}</td>
                        <td className="px-4 py-3 border-t">{serviceName}</td>
                        <td className="px-4 py-3 border-t">{booking.notes || "-"}</td>
                        <td className="px-4 py-3 border-t">{getStatusBadge(booking.status)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {/* Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">
                    Total Bookings: <span className="font-semibold">
                      {Array.isArray(bookings) ? bookings.length : 0}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={fetchBookings}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div> 
  );
};

export default UserDashboard;