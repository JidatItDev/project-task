import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";  

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Login page mounted");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });

      console.log("Login response:", response.data);
      console.log(localStorage.getItem('user'));


      if (response.data.token) {
        // Save user data in localStorage
        localStorage.setItem("user", JSON.stringify({
          token: response.data.token,
          id: response.data.id,   
          email: response.data.email,      
          role: response.data.role,
        }));

        setSuccess("Login successful");
        console.log("token here:", localStorage.getItem('user'));

        //redirect to the users dashboard based on their role
        if (response.data.role === "user") {
          navigate("/user/dashboard");
        } else if (response.data.role === "admin") {
          navigate("/admin/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>

      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "12px", textAlign: "center" }}>
        Not Registered Yet?{" "}
        <Link to="/register" style={{ color: "#007bff", textDecoration: "none" }}>
          Go to Register
        </Link>
      </p>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
    </div>
  );
};

export default Login;

const styles = {
  container: {
    maxWidth: "400px",
    margin: "80px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
  success: {
    color: "green",
    marginTop: "10px",
  },
};
