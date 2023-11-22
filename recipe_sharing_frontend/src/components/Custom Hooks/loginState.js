import { useState, useEffect } from "react";
import axios from "axios";

const useAuthentication = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const verifyToken = async (token) => {
      try {
        // Send a request to verify the token
        await axios.post("http://127.0.0.1:8000/authentication/jwt/verify", {
          token: token,
        });

        // Token verification successful, set isLoggedIn to true
        setIsLoggedIn(true);
      } catch (error) {
        // Token verification failed or request error occurred
        // Clear the invalid token from local storage and set isLoggedIn to false
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
      }
    };

    const refreshTokenAndLogin = async (refreshToken) => {
      try {
        // Send a request to refresh the token
        const response = await axios.post(
          "http://127.0.0.1:8000/authentication/jwt/refresh",
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = response.data.access;

        // Save the new access token in local storage
        localStorage.setItem("accessToken", newAccessToken);

        // Verify the new access token
        verifyToken(newAccessToken);
      } catch (error) {
        // Refresh token failed or request error occurred
        // Clear the tokens from local storage and set isLoggedIn to false
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
      }
    };

    if (accessToken) {
      verifyToken(accessToken);
    } else if (refreshToken) {
      refreshTokenAndLogin(refreshToken);
    }
  }, []);

  return isLoggedIn;
};

export default useAuthentication;
