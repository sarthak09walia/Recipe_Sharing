import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import loginState from "./loginState";
import getUser from "./getUser";
import axios from "axios";
import { Dialog } from "primereact/dialog";

const UserDetails = () => {
  const { name, email, image } = getUser();
  const [profileImage, setProfileImage] = useState(image);
  const isLoggedIn = loginState();
  const [userRecipes, getUserRecipies] = useState([]);
  const [visibleRecipeId, setVisibleRecipeId] = useState(null);
  const [confirmationStates, setConfirmationStates] = useState([]);
  const [imageStatus, setImageStatus] = useState(false);
  const [pImage, setPImage] = useState(null);
  const [passwordChange, setPasswordChangeStatus] = useState(false);
  const [current, setCurrent] = useState("");
  const [npassword, setNpassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState(false);
  const [nemail, setNemail] = useState("");
  const [emailChange, setEmailChangeStatus] = useState(false);
  const [reemail, setReemail] = useState("");
  const [emailStatus, setEmailStatus] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [emailerror, setEmailError] = useState("");
  const [passworderror, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(false);

  useEffect(() => {
    const initialConfirmationStates = userRecipes.map(() => false);
    setConfirmationStates(initialConfirmationStates);
  }, [userRecipes]);

  const toggleConfirmationState = (index) => {
    const newConfirmationStates = [...confirmationStates];
    newConfirmationStates[index] = !newConfirmationStates[index];
    setConfirmationStates(newConfirmationStates);
  };
  useEffect(() => {
    const getUserRecipes = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        };

        const response = await axios.get(
          "http://127.0.0.1:8000/recipe/user-recipes/",
          {
            headers: headers,
          }
        );

        getUserRecipies(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    getUserRecipes();
  }, []);

  const openModal = (recipeId) => {
    setVisibleRecipeId(recipeId);
  };

  const closeModal = () => {
    setVisibleRecipeId(null);
  };

  const recipeDelete = async (recipeId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      await axios.delete(
        `http://127.0.0.1:8000/recipe/delete-recipe/${recipeId}`,

        {
          headers: headers,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const profileImageUpdate = async (email) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      };
      const formData = new FormData();
      formData.append("image", pImage);
      await axios.post(
        `http://127.0.0.1:8000/update-image/${email}/`,
        formData,
        {
          headers: headers,
        }
      );

      setImageStatus(false);

      setProfileImage(URL.createObjectURL(pImage));
    } catch (err) {
      console.error(err);
    }
  };

  const PasswordChangeHandler = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      };

      await axios.post(
        `http://127.0.0.1:8000/authentication/users/set_password/`,
        {
          current_password: current,
          new_password: npassword,
          re_new_password: repassword,
        },
        {
          headers: headers,
        }
      );

      setPasswordStatus(true);
      setTimeout(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.reload(true);
      }, 2000);
    } catch (err) {
      console.error(err.response.data);

      if (err.response && err.response.status === 400) {
        const {
          new_password,
          re_new_password,
          current_password,
          non_field_errors,
        } = err.response.data;

        // Update the error state with the error messages
        setPasswordError({
          new_password: new_password ? new_password[0] : null,
          re_new_password: re_new_password ? re_new_password[0] : null,
          current_password: current_password ? current_password[0] : null,
          non_field_errors: non_field_errors ? non_field_errors[0] : null,
        });
      } else {
        // Handle other types of errors
        setPasswordError("An unexpected error occurred.");
      }
    }
  };

  const emailChangeHandler = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      };

      await axios.post(
        `http://127.0.0.1:8000/authentication/users/set_email/`,
        {
          current_password: current,
          new_email: nemail,
          re_new_email: reemail,
        },
        {
          headers: headers,
        }
      );

      setEmailStatus(true);
      setTimeout(() => {
        window.location.reload(true);
      }, 2000);
    } catch (err) {
      console.error(err.response.data);

      if (err.response && err.response.status === 400) {
        const { new_email, re_new_email, current_password } = err.response.data;

        // Update the error state with the error messages
        setEmailError({
          new_email: new_email ? new_email[0] : null,
          re_new_email: re_new_email ? re_new_email[0] : null,
          current_password: current_password ? current_password[0] : null,
        });
      } else {
        // Handle other types of errors
        setEmailError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="text-center container">
      {isLoggedIn ? (
        <div className="container">
          <h1 className="mb-3">User Details</h1>
          <div className="row">
            <div className="col-lg-4 col-xl-4 col-xxl-4 col-12 col-md-12 col-sm-12">
              <div className="border border-1 rounded-2">
                <img
                  src={profileImage || image}
                  alt={name}
                  // style={{ width: "400px", height: "300px" }}
                  className="rounded rounded-2 mb-5 img-fluid"
                ></img>
              </div>
              <ul className="list-group d-flex justify-content-between">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <p className="m-0">Profile name:</p>
                  <p className="m-0 text-wrap">{name}</p>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <p className="m-0">Profile email:</p>
                  <p className="m-0 text-wrap">{email}</p>
                </div>
              </ul>
              <div className="mt-2 btn-group">
                <button
                  className="btn btn-outline-primary"
                  onClick={(e) => {
                    setImageStatus(true);
                    setPasswordChangeStatus(false);
                    setEmailChangeStatus(false);
                  }}
                >
                  Change Profile Picture
                </button>
                <button
                  className="btn btn-outline-primary"
                  onClick={(e) => {
                    setImageStatus(false);
                    setEmailChangeStatus(false);
                    setPasswordChangeStatus(true);
                  }}
                >
                  Change User Password
                </button>
                <button
                  className="btn btn-outline-primary"
                  onClick={(e) => {
                    setImageStatus(false);
                    setPasswordChangeStatus(false);
                    setEmailChangeStatus(true);
                  }}
                >
                  Change User Email
                </button>
              </div>

              {emailChange && (
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label htmlFor="image" className="form-label display-6">
                      Email change
                    </label>
                    <button
                      className="btn btn-danger ms-3"
                      onClick={(e) => {
                        setEmailChangeStatus(false);
                        setConfirmEmail(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>

                  <label htmlFor="current" className="form-label ">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="current"
                    name="current"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    required
                  />
                  <p className="text-danger">{emailerror.current_password}</p>
                  <label htmlFor="new" className="form-label ">
                    New Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="new"
                    name="new"
                    value={nemail}
                    onChange={(e) => setNemail(e.target.value)}
                    required
                  />
                  <p className="text-danger">{emailerror.new_email}</p>
                  <label htmlFor="re" className="form-label ">
                    Re-Enter new Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="re"
                    name="re"
                    value={reemail}
                    onChange={(e) => setReemail(e.target.value)}
                    required
                  />
                  <p className="text-danger">{emailerror.re_new_email}</p>
                  {confirmEmail ? (
                    <div className="alert alert-danger mt-2" role="alert">
                      Are you sure you want to change email? <br />
                      To change click confirm
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger ms-3"
                        onClick={emailChangeHandler}
                      >
                        Confirm
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmEmail(true)}
                      className="btn btn-primary mt-2"
                    >
                      Confirm
                    </button>
                  )}
                  {emailStatus && (
                    <h3 className="mt-3">Email Change Successful</h3>
                  )}
                </div>
              )}

              {passwordChange && (
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label htmlFor="image" className="form-label display-6">
                      Password change
                    </label>
                    <button
                      className="btn btn-danger ms-3"
                      onClick={() => {
                        setPasswordChangeStatus(false);
                        setConfirmPassword(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>

                  <label htmlFor="current" className="form-label ">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="current"
                    name="current"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    required
                  />
                  <p className="text-danger">
                    {passworderror.current_password}
                  </p>
                  <p className="text-danger">
                    {passworderror.non_field_errors}
                  </p>
                  <label htmlFor="new" className="form-label ">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="new"
                    name="new"
                    value={npassword}
                    onChange={(e) => setNpassword(e.target.value)}
                    required
                  />
                  <p className="text-danger">{passworderror.new_password}</p>
                  <label htmlFor="re" className="form-label ">
                    Re-Enter new Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="re"
                    name="re"
                    value={repassword}
                    onChange={(e) => setRepassword(e.target.value)}
                    required
                  />
                  <p className="text-danger">{passworderror.re_new_password}</p>
                  {confirmPassword ? (
                    <div className="alert alert-danger mt-2" role="alert">
                      Are you sure you want to change Password? <br />
                      To change click confirm
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger ms-3"
                        onClick={PasswordChangeHandler}
                      >
                        Confirm
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmPassword(true)}
                      className="btn btn-primary mt-2"
                    >
                      Confirm
                    </button>
                  )}

                  {passwordStatus && (
                    <h3 className="mt-3">Password Change Successful</h3>
                  )}
                </div>
              )}

              {imageStatus && (
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label htmlFor="image" className="form-label display-6">
                      Profile Image
                    </label>
                    <button
                      className="btn btn-danger ms-3"
                      onClick={(e) => setImageStatus(false)}
                    >
                      Cancel
                    </button>
                  </div>
                  <input
                    type="file"
                    className="form-control"
                    id="photo"
                    name="image"
                    onChange={(e) => setPImage(e.target.files[0])}
                    required
                  />
                  <div className="border border-1 rounded-2 m-3">
                    {pImage && (
                      <div>
                        <img
                          src={URL.createObjectURL(pImage)}
                          alt={pImage.name}
                          style={{ width: "300px", height: "300px" }}
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => profileImageUpdate(email)}
                    className="btn btn-primary"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
            <div className="col-lg-8 col-xl-8 col-xxl-8 col-12 col-md-12 col-sm-12 mt-3">
              <div className="row">
                {userRecipes.map((recipe, index) => (
                  <div className="col-md-6" key={recipe.id}>
                    <div className="card mb-4">
                      <img
                        src={`http://127.0.0.1:8000${recipe.image}`}
                        className="card-img-top img-fluid"
                        alt={recipe.name}
                        style={{
                          maxWidth: 500,
                          maxHeight: 250,
                          minWidth: 125,
                          minHeight: 250,
                        }}
                      />
                      <div className="card-body row">
                        <div className="col-8">
                          <h5 className="card-title">{recipe.name}</h5>
                        </div>
                        <div className="col-4">
                          <h4 className="badge bg-secondary">{recipe.user}</h4>
                        </div>

                        {confirmationStates[index] ? (
                          <div className="alert alert-danger" role="alert">
                            Are you sure you want to delete? <br />
                            To delete click confirm
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger ms-3"
                              onClick={() => recipeDelete(recipe.id)}
                            >
                              Confirm
                            </button>
                          </div>
                        ) : (
                          <div
                            className="btn-group"
                            role="group"
                            aria-label="Basic example"
                          >
                            <button
                              type="button"
                              className="btn btn-outline-info"
                              onClick={() => openModal(recipe.id)}
                            >
                              View
                            </button>
                            <Link
                              type="button"
                              to={`editrecipe/${recipe.id}`}
                              className="btn btn-outline-warning"
                            >
                              Edit
                            </Link>
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => toggleConfirmationState(index)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="card flex justify-content-center">
                      <Dialog
                        header={recipe.name}
                        visible={visibleRecipeId === recipe.id}
                        style={{ width: "60vw" }}
                        onHide={closeModal}
                      >
                        <div className="col-12 border rounded-1 text-center p-2">
                          <div className="row">
                            <div className="col-4">
                              <h6 className="display-6">Ingredients</h6>
                              {recipe.ingredients.map((ingredient, index) => (
                                <ul>
                                  <p>
                                    {index + 1}
                                    {".  "}
                                    {ingredient}
                                  </p>
                                </ul>
                              ))}
                            </div>
                            <div className="col-8">
                              <h6 className="display-6">Steps</h6>
                              {recipe.steps.map((step, index) => (
                                <ul>
                                  <p className="text-break">
                                    {index + 1}
                                    {".  "}
                                    {step}
                                  </p>
                                </ul>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="display-6">If you are not logged in please log in</h1>
          <Link to="/login" className="btn btn-primary">
            Click here
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
