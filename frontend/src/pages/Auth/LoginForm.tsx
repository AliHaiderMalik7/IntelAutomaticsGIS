import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { loginUser } from "../../api/loginApi";

interface LoginPageProps {
  updateToken: (token: string | null) => void; // Callback to update token in parent
}

const LoginPage: React.FC<LoginPageProps> = ({ updateToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Redirect after login

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await loginUser(email, password);

      if (response.token) {
        localStorage.setItem("token", response.token); // Store token
        updateToken(response.token); // Update token state in parent
        navigate("/"); // Redirect to home
      }
    } catch (err: any) {
      setError(err.message || "Login failed"); // Show error message
    }
  };

  return (
    <div className="login-container d-flex">
      <div className="login-image"></div>
      <div className="login-form-container d-flex align-items-center justify-content-center">
        <div className="login-form shadow p-5 bg-white rounded">
          <div className="text-center mb-4">
            <img src="intellogo.png" alt="Logo" className="login-logo" />
          </div>

          <h2 className="signin-title text-center">Sign In</h2>
          <h3 className="login-title text-center">Login to your account</h3>

          {error && <p className="text-danger text-center">{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-dark fw-bold">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="password"
                className="form-label text-dark fw-bold">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 py-2 fw-bold mt-3 login-form-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
