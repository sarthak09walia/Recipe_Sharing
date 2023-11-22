import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import useAuthentication from "../Custom Hooks/loginState";

const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isLoggedIn = useAuthentication();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/authentication/jwt/create",
        {
          email: userEmail,
          password: userPassword,
        }
      );
      const { access, refresh } = response.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      setUserEmail("");
      setUserPassword("");
      setError("");
      navigate("/");
      window.location.reload(true);
    } catch (error) {
      console.log(error);
      if (error.response) {
        setError(error.response.data.detail);
      } else {
        setError("An error occurred during login.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title text-center">Login</h1>
          {error && (
            <p className="text-danger text-center">Invalid Credentials</p>
          )}
          {isLoggedIn ? (
            <div className="m-5">
              <p>You are logged in.</p>
              <button className="btn btn-primary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="m-3">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password:
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </form>
              <p className="mt-3">
                <Link to="/forgotpassword">Forgot Password</Link>
              </p>
              <p>
                If not registered <Link to="/register">Click here</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
