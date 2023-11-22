import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const ActivationPage = () => {
  const { uid, token } = useParams();
  const [activated, setActivated] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const activateAccount = async () => {
      try {
        // Send a request to activate the account
        await axios.post(
          "http://127.0.0.1:8000/authentication/users/activation/",
          {
            uid: uid,
            token: token,
          }
        );
        setActivated(true);
      } catch (error) {
        setError(error.response.data.uid);
      }
    };

    activateAccount();
  }, [uid, token]);

  return (
    <div className="text-center">
      {error ? (
        <h1 className="text-center mt-3">{error}</h1>
      ) : (
        <div>
          {activated ? (
            <div className="text-center mt-3">
              <h1>You account has been activated. Please log in</h1>
              <Link to="/login" className="btn btn-primary">
                Click here
              </Link>
            </div>
          ) : (
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivationPage;
