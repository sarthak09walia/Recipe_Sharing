import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import loginState from "../Custom Hooks/loginState";
import axios from "axios";

const Layout = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isLoggedIn = loginState();
  const [theme, setTheme] = useState("dark");
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.reload(true);
  };
  const [searchState, setSearchState] = useState(false);
  const [searched, setSearched] = useState("");
  const [searchedResult, setSearchedResult] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searched.length > 0) searchUser();
    else setSearchedResult([]); // Reset searchedResult to an empty array
    // eslint-disable-next-line
  }, [searched]);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const toggleTheme = () => {
    const htmlElement = document.querySelector("html");
    if (theme === "dark") {
      htmlElement.setAttribute("data-bs-theme", "light");
      setTheme("light");
    } else {
      htmlElement.setAttribute("data-bs-theme", "dark");
      setTheme("dark");
    }
  };

  const searchUser = async (e) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      };
      const search = await axios.get(
        `http://127.0.0.1:8000/search-user/${searched}/`,
        {
          headers: headers,
        }
      );
      if (search.data.result === "No data found") {
        setSearchedResult([]); // Set an empty array to indicate no profiles found
      } else {
        setSearchedResult(search.data.result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand display-1">
            YumShare
          </Link>
          <button className="navbar-toggler" type="button" onClick={toggleNav}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`}
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={toggleNav}>
                  Home
                </Link>
              </li>

              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link
                      to="addrecipe"
                      className="nav-link"
                      onClick={toggleNav}
                    >
                      Add Recipe
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="profile" className="nav-link" onClick={toggleNav}>
                      Profile
                    </Link>
                  </li>
                  {searchState ? (
                <div>
                  <form className="form-inline my-2 my-lg-0">
                    <div className="input-group">
                      <input
                        className="form-control mr-sm-2"
                        type="search"
                        placeholder="Search Profile"
                        aria-label="Search"
                        value={searched}
                        onChange={(e) => setSearched(e.target.value)}
                      />
                    </div>
                  </form>
                  {searchedResult.length > 0 ? (
                    <ul
                      className="list-group"
                      style={{ position: "absolute", zIndex: 1 }}
                    >
                      {searchedResult.map((result, index) => (
                        <li
                          className="list-group-item d-flex align-items-center"
                          key={index}
                          onClick={() => {
                            navigate(`/profile/${result.id}`);
                            // window.location.reload(true);
                          }}
                        >
                          <img
                            src={`http://127.0.0.1:8000${result.image}`}
                            alt={result.name}
                            height={30}
                            width={30}
                            className="me-2"
                          />
                          {result.name}
                        </li>
                      ))}
                    </ul>
                  ) : searched.length === 0 ? null : (
                    <p
                      className="text-center"
                      style={{ position: "absolute", zIndex: 1 }}
                    >
                      No profiles found
                    </p>
                  )}
                </div>
              ) : (
                <li className="nav-item">
                  {" "}
                  <button
                    className="nav-link ms-auto "
                    onClick={() => setSearchState(true)}
                  >
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </button>
                </li>
              )}
                </>
              ) : null}
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item">
                {theme === "dark" ? (
                  <button
                    onClick={toggleTheme}
                    className="nav-link ms-auto btn btn-outline-info"
                  >
                    Light
                  </button>
                ) : (
                  <button
                    onClick={toggleTheme}
                    className="nav-link ms-auto btn btn-outline-info"
                  >
                    Dark
                  </button>
                )}
              </li>
              <li className="nav-item">
                {isLoggedIn ? (
                  <Link
                    onClick={handleLogout}
                    className="nav-link btn btn-danger ms-auto text-light"
                  >
                    Logout
                  </Link>
                ) : (
                  <Link
                    to="login"
                    className="nav-link ms-auto btn btn-outline-primary"
                    onClick={toggleNav}
                  >
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
