import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    age: ""
  });
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, signup, useLocalAuth } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        await signup(form.email, form.password, {
          name: form.name || "",
          age: form.age || ""
        });
        setForm({ email: "", password: "", name: "", age: "" });
      } else {
        await login(form.email, form.password);
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Auth error:", error);
      setError(error.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "100px auto",
      padding: "30px",
      borderRadius: "12px",
      background: "#f5f7fa",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", color: "#ff4d8d" }}>
        {isSignup ? "Create Account" : "Sign In"}
      </h2>

      {useLocalAuth && (
        <div style={{
          background: "#fff3cd",
          color: "#856404",
          padding: "12px",
          borderRadius: "6px",
          marginBottom: "15px",
          fontSize: "13px",
          textAlign: "center"
        }}>
          🧪 <strong>Development Mode:</strong> Using local authentication for testing
        </div>
      )}

      {error && (
        <div style={{
          color: "red",
          marginBottom: "15px",
          textAlign: "center"
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {isSignup && (
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            style={inputStyle}
            required
          />
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          style={inputStyle}
          required
        />

        {isSignup && (
          <input
            name="age"
            type="number"
            placeholder="Age"
            onChange={handleChange}
            style={inputStyle}
          />
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            background: "#ff4d8d",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          {loading ? "Please wait..." : (isSignup ? "Sign Up" : "Sign In")}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={() => setIsSignup(!isSignup)}
          style={{
            background: "none",
            border: "none",
            color: "#ff4d8d",
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          {isSignup ? "Already have an account? Sign In" : "Need an account? Sign Up"}
        </button>
      </div>

      {useLocalAuth && (
        <div style={{
          marginTop: "20px",
          padding: "12px",
          background: "#f0f0f0",
          borderRadius: "6px",
          fontSize: "12px",
          color: "#666",
          textAlign: "center"
        }}>
          <strong>To enable production Firebase Auth:</strong><br/>
          1. Go to Firebase Console &gt; Authentication<br/>
          2. Enable "Email/Password" sign-in method<br/>
          3. Then restart the app
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "8px 0",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "16px",
  boxSizing: "border-box"
};

export default Login;