import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminGetAllUsers } from "../../services/booking.service"; 

const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Users List</h2>
        <button onClick={fetchUsers} style={{ padding: "8px 12px", cursor: "pointer" }}>
          Refresh
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>ID</th>
                <th style={th}>Name</th>
                <th style={th}>Email</th>
                <th style={th}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr key={user.id} style={{ borderTop: "1px solid #eee" }}>
                    <td style={td}>{user.id}</td>
                    <td style={td}>{user.name}</td>
                    <td style={td}>{user.email}</td>
                    <td style={td}>{user.role}</td>
                    <td style={td}>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersListPage;

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
