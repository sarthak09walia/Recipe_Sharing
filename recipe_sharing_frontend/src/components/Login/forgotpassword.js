import React, { useState } from "react";
import axios from "axios";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [state, setState] = useState(true);
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    setState(false);
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/authentication/users/reset_password/",
        { email: email }
      );
      console.log(response.data);
      setError("");
      setEmail("");
      setTimeout(() => {
        setState(true);
      }, 2000);
    } catch (error) {
      setState(true);
      console.log(error.response.data);
      setError(error.response.data);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      {state ? (
        <div className="card">
          <div className="card-body">
            <h1 className="card-title text-center">Forgot Password</h1>
            <div>
              <form onSubmit={handleForgotPassword}>
                <p className="text-center text-danger">{error}</p>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>
                  <input
                    type="text"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div class="d-flex justify-content-center">
          <div
            class="spinner-border spinner-border-lg"
            role="status"
            style={{ width: "300px", height: "300px" }}
          >
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordReset;
