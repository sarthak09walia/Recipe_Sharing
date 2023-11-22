import userDetails from "../Custom Hooks/getUser";
import { useState, useEffect } from "react";
import axios from "axios";
import "./home.css";
import { Dialog } from "primereact/dialog";

const Home = () => {
  const { name, id, image } = userDetails();
  const [recipes, setRecipes] = useState([]);
  const [visibleRecipeId, setVisibleRecipeId] = useState(null);
  const [visibleCommentId, setVisibleCommentId] = useState([]);
  const [hoveredRecipeId, setHoveredRecipeId] = useState([]);
  const [userLikedRecipes, setUserLikedRecipes] = useState([]);
  const [notLoggedInUser, setNotLoggedInUser] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [visibleShareId, setVisibleShareId] = useState([]);
  const [shareState, setShareState] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/recipe/get-all/"
        );
        setRecipes(response.data);
      } catch (e) {
        console.log("error", e);
      }
    };
    fetchRecipes();
  }, [userLikedRecipes, commentInput]);

  useEffect(() => {
    const fetchLikedRecipes = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/recipe/get-liked/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUserLikedRecipes(response.data);
      } catch (e) {
        console.log("error", e);
      }
    };

    fetchLikedRecipes();
  }, []);

  const openModal = (recipeId) => {
    setVisibleRecipeId(recipeId);
  };

  const closeModal = () => {
    setVisibleRecipeId(null);
  };

  const openShareModal = (recipeId) => {
    setVisibleShareId(recipeId);
    setShareState(true);
    const textToCopy = `http://127.0.0.1:3000/recipe/${recipeId}`;
    navigator.clipboard.writeText(textToCopy);
    setTimeout(() => {
      setShareState(false);
    }, 5000);
  };

  const closeShareModal = () => {
    setVisibleShareId(null);
  };

  const openCommentModal = (recipeId) => {
    setVisibleCommentId(recipeId);
  };

  const closeCommentModal = () => {
    setVisibleCommentId(null);
  };

  const handleMouseEnter = (recipeId) => {
    setHoveredRecipeId(recipeId);
  };

  const handleMouseLeave = () => {
    setHoveredRecipeId(null);
  };
  const handleCommentInputChange = (event) => {
    setCommentInput(event.target.value);
  };

  const postComment = async (e) => {
    if (commentInput.trim() === "") {
      return;
    }
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };

      const commentData = {
        recipe: visibleCommentId,
        content: commentInput,
        user: id,
      };

      await axios.post(
        "http://127.0.0.1:8000/recipe/create-comment/",
        commentData,
        { headers: headers }
      );

      setCommentInput("");
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleLike = async (recipeId) => {
    if (name.length > 0) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        };

        await axios.post(
          "http://127.0.0.1:8000/recipe/toggle-like/",
          { recipe_id: recipeId },
          { headers: headers }
        );

        // Update the userLikedRecipes state with the updated recipe ID
        setUserLikedRecipes((prevLikedRecipes) => [
          ...prevLikedRecipes,
          recipeId,
        ]);
      } catch (e) {
        console.log("error", e);
      }
    } else {
      setNotLoggedInUser(true);
      setTimeout(() => {
        setNotLoggedInUser(false);
      }, 10000);
    }
  };

  const handleUnlike = async (recipeId) => {
    // Make the API request to toggle like
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };

      await axios.post(
        "http://127.0.0.1:8000/recipe/toggle-like/",
        { recipe_id: recipeId },
        { headers: headers }
      );

      setUserLikedRecipes((prevLikedRecipes) =>
        prevLikedRecipes.filter((id) => id !== recipeId)
      );
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <div className="container" style={{ backgroundColor: "" }}>
      <h1 className="text-center mt-3 display-4">Welcome {name}</h1>
      <hr />
      {notLoggedInUser && (
        <div className="alert alert-info" role="alert">
          You Must Be Logged in to Like
        </div>
      )}
      <div className="row">
        {recipes.map((recipe) => (
          <div className="col-md-6 col-xl-4 col-lg-4 col-sm-6" key={recipe.id}>
            <div
              className="card mb-4"
              onMouseEnter={() => handleMouseEnter(recipe.id)}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={`http://127.0.0.1:8000${recipe.image}`}
                className="card-img-top img-fluid brightness-20"
                alt={recipe.name}
                style={{
                  maxWidth: 500,
                  maxHeight: 250,
                  minWidth: 250,
                  minHeight: 250,
                }}
              />

              <div className="card-img-overlay row ">
                <div className="col-12">
                  <h4 className="card-title text-light text-start text-start ">
                    {recipe.name}
                  </h4>
                </div>

                {hoveredRecipeId === recipe.id && (
                  <div className="row">
                    <div className="col-12">
                      <div className="image-overlay">
                        <p
                          onClick={() => openModal(recipe.id)}
                          className="card-text text-center text-light px-3 mb-2"
                        >
                          {recipe.description}
                        </p>
                        <p className="card-text text-center text-light rounded-2 fw-semibold">
                          Provided by {recipe.user}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="btn-group card-body" role="group">
                {userLikedRecipes.includes(recipe.id) ? (
                  <div className="btn position-relative">
                    <button
                      type="button"
                      className="btn "
                      onClick={() => handleUnlike(recipe.id)}
                      name={`like-${recipe.id}`}
                      id={`like-${recipe.id}`}
                    >
                      <i className="far fa-thumbs-down me-2"></i> Unlike
                    </button>

                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {recipe.total_likes}
                      <span className="visually-hidden">Like</span>
                    </span>
                  </div>
                ) : (
                  <div className="btn position-relative">
                    <button
                      type="button"
                      className="btn "
                      onClick={() => handleLike(recipe.id)}
                      name={`like-${recipe.id}`}
                      id={`like-${recipe.id}`}
                    >
                      <i className="far fa-thumbs-up me-2"></i> Like
                    </button>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {recipe.total_likes}
                      <span className="visually-hidden">Like</span>
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  className="btn position-relative"
                  onClick={() => openCommentModal(recipe.id)}
                >
                  Comment
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {recipe.all_comments.length}
                    <span className="visually-hidden">Comment</span>
                  </span>
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => openShareModal(recipe.id)}
                >
                  Share
                </button>
              </div>
            </div>
            <div className="card flex justify-content-center">
              <Dialog
                header={recipe.name}
                visible={visibleRecipeId === recipe.id}
                style={{ width: "60vw" }}
                onHide={closeModal}
                maximizable
              >
                <div className="col-12 border rounded-1 text-center p-2">
                  <div className="row">
                    <div className="col-12 col-lg-4 col-xl-4 col-md-4 text-start">
                      <h6 className="display-6 text-center">Ingredients</h6>
                      <ol>
                        {recipe.ingredients.map((ingredient, index) => (
                          <li key={index}>{ingredient}</li>
                        ))}
                      </ol>
                    </div>
                    <div className="col-12 col-md-8 text-start">
                      <h6 className="display-6 text-center">Instructions</h6>
                      <ol>
                        {recipe.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </Dialog>
            </div>
            <div className="card flex justify-content-center">
              <Dialog
                header={`${recipe.name} Comment Box`}
                visible={visibleCommentId === recipe.id}
                style={{ width: "60vw" }}
                onHide={closeCommentModal}
              >
                <div className="col-12 border rounded-1 text-center ">
                  <section>
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex flex-start align-items-center row">
                          {recipe.all_comments.length > 0 ? (
                            recipe.all_comments.map((comment) => (
                              <div
                                className="col-12 border rounded-2 mb-1"
                                key={comment.id}
                              >
                                <h6 className="fw-bold text-primary mb-1 text-start">
                                  {comment.user}
                                </h6>
                                <p className="text-muted small mb-0 text-start">
                                  Shared publicly - {comment.date.split("T")[0]}
                                </p>
                                <div className="text-start">
                                  <p>{comment.content}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <h1 className="display-6">
                              You can be the first one to comment
                            </h1>
                          )}
                        </div>
                      </div>
                      {name.length > 0 ? (
                        <div className="card-footer py-3 border-0">
                          <div className="d-flex flex-start w-100">
                            <img
                              src={image}
                              alt={name}
                              className="pe-1 rounded rounded-5"
                              style={{ width: "50px", height: "50px" }}
                            />
                            <div className="form-outline w-100">
                              <textarea
                                className="form-control"
                                id="textAreaExample"
                                rows="4"
                                placeholder="Enter your comment.."
                                value={commentInput}
                                onChange={handleCommentInputChange}
                              ></textarea>
                            </div>
                          </div>
                          <div className="float-end mt-2 pt-1">
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={postComment}
                            >
                              Post comment
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="alert alert-info" role="alert">
                          You Must Be Logged in to Comment
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </Dialog>
              <Dialog
                header={`Share ${recipe.name}`}
                visible={visibleShareId === recipe.id}
                style={{ width: "60vw" }}
                onHide={closeShareModal}
              >
                <p>{`http://127.0.0.1:3000/recipe/${visibleShareId}`}</p>
                {shareState && (
                  <div className="alert alert-info" role="alert">
                    Link Copied!!
                  </div>
                )}
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
