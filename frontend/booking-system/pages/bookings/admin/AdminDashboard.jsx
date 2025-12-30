import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";  
import AdminSidebar from "../../../components/layout/Sidebar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar
} from "lucide-react";

const API_URL = "http://localhost:3001";

const socket = io("http://localhost:3001");

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token;
};

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    totalBookings: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  });

  // Fetch initial bookings when component mounts
  const fetchBookings = async () => {
    setError("");
    setLoading(true);

    try {
      const token = getToken();
      const res = await axios.get(`${API_URL}/admin/getAllBookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setBookings(data);
      
      // Calculate stats
      const pending = data.filter(b => b.status === "pending").length;
      const accepted = data.filter(b => b.status === "accepted").length;
      const rejected = data.filter(b => b.status === "rejected").length;
      
      setStats({
        totalBookings: data.length,
        pending,
        accepted,
        rejected
      });
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(); 

    socket.on("booking-added", (newBooking) => {
      console.log("New booking received via Socket.IO:", newBooking);

      setBookings((prevBookings) => [newBooking, ...prevBookings]);

      // Update stats
      setStats((prevStats) => ({
        ...prevStats,
        totalBookings: prevStats.totalBookings + 1,
        pending: newBooking.status === "pending" ? prevStats.pending + 1 : prevStats.pending,
        accepted: newBooking.status === "accepted" ? prevStats.accepted + 1 : prevStats.accepted,
        rejected: newBooking.status === "rejected" ? prevStats.rejected + 1 : prevStats.rejected,
      }));
    });

    // Cleanup the socket listener when the component is unmounted
    return () => {
      socket.off("booking-added");
    };
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
        prev.map((b) => {
          const id = b.id ?? b._id;
          return id === bookingId ? { ...b, status } : b;
        })
      );

      // Update stats
      setStats(prev => {
        const oldStatus = bookings.find(b => {
          const id = b.id ?? b._id;
          return id === bookingId;
        })?.status;
        
        const updates = { ...prev };
        if (oldStatus) updates[oldStatus] -= 1;
        updates[status] += 1;
        return updates;
      });

      console.log("Status updated:", res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update booking status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" /> Accepted</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
            <p className="mt-2 text-gray-600">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Manage bookings and users</p>
            </div>
            <Button onClick={fetchBookings} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total Bookings</p>
                    <h3 className="text-3xl font-bold text-blue-900">{stats.totalBookings}</h3>
                  </div>
                  <Calendar className="h-10 w-10 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-yellow-700">Pending</p>
                    <h3 className="text-3xl font-bold text-yellow-900">{stats.pending}</h3>
                  </div>
                  <Clock className="h-10 w-10 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-green-700">Accepted</p>
                    <h3 className="text-3xl font-bold text-green-900">{stats.accepted}</h3>
                  </div>
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-red-700">Rejected</p>
                    <h3 className="text-3xl font-bold text-red-900">{stats.rejected}</h3>
                  </div>
                  <XCircle className="h-10 w-10 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Bookings Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>Manage and update booking status</CardDescription>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">No bookings found</h3>
                  <p className="text-gray-600">Bookings will appear here once created.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => {
                        const bookingId = booking.id ?? booking._id;
                        const userLabel = 
                          booking.user?.name ?? 
                          booking.user?.email ?? 
                          booking.userName ?? 
                          booking.email ?? 
                          booking.userId ?? 
                          "-";

                        // Ensure userLabel is a string and safe for charAt
                        const userInitial = typeof userLabel === 'string' && userLabel.length > 0 ? userLabel.charAt(0).toUpperCase() : '-';

                        const start = booking.startTime
                          ? new Date(booking.startTime).toLocaleString()
                          : "-";
                        const end = booking.endTime
                          ? new Date(booking.endTime).toLocaleString()
                          : "-";

                        return (
                          <TableRow key={bookingId}>
                            <TableCell className="font-medium">{bookingId}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-xs font-medium">
                                    {userInitial}
                                  </span>
                                </div>
                                <span className="truncate max-w-[150px]">{userLabel}</span>
                              </div>
                            </TableCell>
                            <TableCell>{start}</TableCell>
                            <TableCell>{end}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {booking.notes || "-"}
                            </TableCell>
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Select
                                  value={booking.status || "pending"}
                                  disabled={updatingId === bookingId}
                                  onValueChange={(value) => updateBookingStatus(bookingId, value)}
                                >
                                  <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="accepted">Accepted</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                  </SelectContent>
                                </Select>
                                {updatingId === bookingId && (
                                  <RefreshCw className="h-4 w-4 animate-spin text-gray-500" />
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
