import React, { useState } from "react";
import axios from "axios";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submit, setSubmit] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const formDataWithImage = new FormData();
    formDataWithImage.append("name", name);
    formDataWithImage.append("email", email);
    formDataWithImage.append("password", password);
    formDataWithImage.append("re_password", rePassword);

    try {
      await axios.post(
        "http://127.0.0.1:8000/authentication/users/",
        formDataWithImage
      );
      setSubmit(true);
      setName("");
      setEmail("");
      setPassword("");
      setRePassword("");
      setError("");
    } catch (error) {
      if (error.response.password) {
        setError(error.response.data.password);
        setSubmit(false);
      } else if (error.response.data.email) {
        setErrorEmail(error.response.data.email);
        setSubmit(false);
      } else if (error.response.data.non_field_errors) {
        setError(error.response.data.non_field_errors);
        setSubmit(false);
      } else {
        setError("An error occurred during registration.");
        setSubmit(false);
      }
    }

    setIsLoading(false);
  };

  return (
    <div>
      {submit ? (
        <div className="text-center align-items-center">
          <h3>Please check your email for activation email and then login</h3>
        </div>
      ) : (
        <div className="container">
          <h1>Register</h1>
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {errorEmail && <p className="text-danger">{errorEmail}</p>}

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-danger">{error}</p>}
              <div className="mb-3">
                <label htmlFor="rePassword" className="form-label">
                  Re-enter Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="rePassword"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default RegisterForm;
