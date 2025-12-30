import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { adminGetAllUsers } from "../../services/booking.service";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/layout/Sidebar";

const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await adminGetAllUsers();
      // Ensure we have an array and handle potential undefined/null responses
      setUsers(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      console.error("Error fetching users:", e);
      setError(e.response?.data?.message || e.message || "Failed to load users");
      setUsers([]); // Reset users on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Show loading state with proper layout
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8 lg:p-10 ml-0 md:ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading users...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Safe check for users array
  const safeUsers = Array.isArray(users) ? users : [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <main className="flex-1 p-6 md:p-8 lg:p-10 ml-0 md:ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Button
            onClick={() => navigate("/admin/dashboard")}
            variant="outline"
            className="mb-6 h-10 px-6 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-100"
          >
            Back to Dashboard
          </Button>

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
              <p className="text-gray-600 mt-2">View and manage all registered users</p>
            </div>
            
            <Button
              onClick={fetchUsers}
              variant="outline"
              className="h-10 px-6 text-sm font-medium text-blue-600 border border-blue-600 hover:bg-blue-50 self-start sm:self-center"
            >
              Refresh Users
            </Button>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-8">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Users List</h2>
              <p className="text-gray-500 text-sm mt-1">
                {safeUsers.length} user{safeUsers.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* No Users Found */}
            {safeUsers.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No users found</h3>
                <p className="text-gray-500 mb-4">{error ? "Error loading users" : "There are no registered users in the system yet."}</p>
                <Button onClick={fetchUsers} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableCell className="font-semibold text-gray-700 py-4">#</TableCell>
                      <TableCell className="font-semibold text-gray-700 py-4">Name</TableCell>
                      <TableCell className="font-semibold text-gray-700 py-4">Email</TableCell>
                      <TableCell className="font-semibold text-gray-700 py-4">Role</TableCell>
                      <TableCell className="font-semibold text-gray-700 py-4">Status</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safeUsers.map((user, index) => {
                      // Safely get user properties with fallbacks
                      const userName = user?.name || "Unknown";
                      const userEmail = user?.email || "No email";
                      const userRole = user?.role || "user";
                      // You can add status if available in your user object
                      const userStatus = user?.isActive !== false ? "Active" : "Inactive";
                      
                      return (
                        <TableRow 
                          key={user?._id || user?.id || index}
                          className="hover:bg-gray-50 border-t border-gray-100 transition-colors duration-150"
                        >
                          <TableCell className="py-4">{index + 1}</TableCell>
                          <TableCell className="py-4 font-medium text-gray-900">{userName}</TableCell>
                          <TableCell className="py-4 text-gray-700">{userEmail}</TableCell>
                          <TableCell className="py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              userRole === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : userRole === 'moderator'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell className="py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              userStatus === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {userStatus}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>Showing {safeUsers.length} users • Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UsersListPage;