import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const PasswordReset = () => {
  const [userPassword, setPassword] = useState("");
  const [userRePassword, setRePassword] = useState("");
  const [state, setState] = useState(true);
  const { uid, token } = useParams();
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    setState(false);
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/authentication/users/reset_password_confirm/",
        {
          uid: uid,
          token: token,
          new_password: userPassword,
          re_new_password: userRePassword,
        }
      );
      console.log(response.data);
      setError("");
      setTimeout(() => {
        setState(true);
      }, 2000);
    } catch (error) {
      setState(true);
      console.log(error.response.data);
      if (error.response.data.token) setError("The link has been expired");
      else if (error.response.data.new_password)
        setError(error.response.data.new_password);
      else if (error.response.data.non_field_errors)
        setError(error.response.data.non_field_errors);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      {state ? (
        <div className="card">
          <div className="card-body">
            <h1 className="card-title text-center">Reset Password</h1>
            <div>
              <form onSubmit={handleReset}>
                <p className="text-center text-danger">{error}</p>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Password:
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={userPassword}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Retype Password:
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={userRePassword}
                    onChange={(e) => setRePassword(e.target.value)}
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
