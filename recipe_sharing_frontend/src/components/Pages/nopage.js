import React from "react";
import { Link } from "react-router-dom";
import notFoundImage from "../Assets/404.png";

const NotFound = () => {
  return (
    <div className="text-center">
      <img src={notFoundImage} alt="404" />
      <p className="mb-4">The page you are looking for does not exist.</p>
      <h3 className="mb-4">
        <Link className="text-danger" to="/">
          Home
        </Link>
      </h3>
    </div>
  );
};

export default NotFound;
