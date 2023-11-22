import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import loginState from "../Custom Hooks/loginState";
import { Dialog } from "primereact/dialog";

const Profile = () => {
  const user_id = useParams();
  const isLoggedIn = loginState();
  const [user, setUser] = useState([]);
  const [visibleRecipeId, setVisibleRecipeId] = useState(null);

  useEffect(() => {
    const getuser = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(
          `http://127.0.0.1:8000/specific-user-details/${user_id.id}/`,
          { headers: headers }
        );
        console.log(response.data);
        setUser(response.data);
      } catch (e) {
        console.error(e);
      }
    };

    getuser();
  }, [user_id]);
  const openModal = (recipeId) => {
    setVisibleRecipeId(recipeId);
  };

  const closeModal = () => {
    setVisibleRecipeId(null);
  };

  return (
    <div className="text-center container">
      {isLoggedIn && user.user && user.user.length > 0 ? (
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-xl-12 col-xxl-12 col-12 col-md-12 col-sm-12">
              <div className="border border-1 rounded-2">
                <img
                  src={`http://127.0.0.1:8000${user.user[0].image}`}
                  alt={user.user[0].name}
                  // style={{ width: "400px", height: "300px" }}
                  className="rounded rounded-2 mb-5 img-fluid"
                ></img>
              </div>
              <ul className="list-group d-flex justify-content-between">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <p className="m-0">Profile name:</p>
                  <p className="m-0 text-wrap">{user.user[0].name}</p>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <p className="m-0">Profile email:</p>
                  <p className="m-0 text-wrap">{user.user[0].email}</p>
                </div>
              </ul>
            </div>

            <div className="col-lg-12 col-xl-12 col-xxl-12 col-12 col-md-12 col-sm-12 mt-3">
              <div className="row">
                {user.recipes.map((recipe, index) => (
                  <div className="col-md-6" key={recipe.id}>
                    <div className="card mb-4">
                      <img
                        src={`http://127.0.0.1:8000${recipe.image}`}
                        className="card-img-top img-fluid align-items-center justify-content-center"
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
                        {/* <div className="col-4">
                          <h4 className="badge bg-secondary">{recipe.user}</h4>
                        </div> */}

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
                          {/* <Link
                            type="button"
                            to={`editrecipe/${recipe.id}`}
                            className="btn btn-outline-warning"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={""}
                          >
                            Delete
                          </button> */}
                        </div>
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

export default Profile;
