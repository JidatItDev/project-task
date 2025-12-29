import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Alert, AlertDescription } from "@/components/ui/alert"; // ShadCN Alert
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"; // ShadCN Table
import { adminGetAllUsers } from "../../services/booking.service"; // Your service for getting users
import { useNavigate } from "react-router-dom"; // To navigate back to dashboard

const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook to navigate

  // Fetch users from the API
  const fetchUsers = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await adminGetAllUsers();
      setUsers(res.data);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p style={{ padding: 16 }}>Loading users…</p>;

  return (
    <div className="p-8">
      {/* Back Button */}
      <Button
        onClick={() => navigate("/admin/dashboard")}
        variant="outline"
        className="mb-6 h-10 px-6 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-100"
      >
        Back to Dashboard
      </Button>

      {/* Header Section */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Users List</h2>
        
        {/* Refresh Button */}
        <Button
          onClick={fetchUsers}
          variant="outline"
          className="h-10 px-6 text-sm font-medium text-blue-600 border border-blue-600 hover:bg-blue-50"
        >
          Refresh
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* No Users Found */}
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-lg mx-auto max-w-7xl">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableCell className="font-semibold text-gray-700">#</TableCell>
                <TableCell className="font-semibold text-gray-700">ID</TableCell>
                <TableCell className="font-semibold text-gray-700">Name</TableCell>
                <TableCell className="font-semibold text-gray-700">Email</TableCell>
                <TableCell className="font-semibold text-gray-700">Role</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user._id} className="hover:bg-gray-50 border-t border-gray-200">
                  <TableCell>{index + 1}</TableCell> {/* Indexing column */}
                  <TableCell>{user._id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UsersListPage;
