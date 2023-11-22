import React, { useState } from "react";
import axios from "axios";
import loginState from "../Custom Hooks/loginState";
import Resizer from "react-image-file-resizer";
import { Link } from "react-router-dom";
import getUser from "../Custom Hooks/getUser";

const ReportForm = () => {
  // eslint-disable-next-line
  const { name, email, id } = getUser();
  const [image, setImage] = useState(null);
  const isLoggedIn = loginState();
  const [submitState, setSubmitState] = useState(false);
  const [submissionState, setSubmissionState] = useState(false);
  const [steps, setSteps] = useState([""]);
  const [ingredients, setIngredients] = useState([""]);
  const [recipeName, setRecipeName] = useState("");

  const [recipeDescription, setRecipeDescription] = useState("");

  const handleChange = (event) => {
    const { value } = event.target;
    if (value.length <= 200) {
      setRecipeDescription(value);
    }
  };
  const handleStepChange = (event, index) => {
    const { value } = event.target;
    setSteps((prevSteps) => {
      const newSteps = [...prevSteps];
      newSteps[index] = value;
      return newSteps;
    });
  };

  const addStep = () => {
    setSteps((prevSteps) => [...prevSteps, ""]);
  };

  const removeStep = (index) => {
    setSteps((prevSteps) => {
      const newSteps = [...prevSteps];
      newSteps.splice(index, 1);
      return newSteps;
    });
  };
  const removeIngredient = (index) => {
    setIngredients((prevSteps) => {
      const newSteps = [...prevSteps];
      newSteps.splice(index, 1);
      return newSteps;
    });
  };

  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    setIngredients((prevIngredients) => {
      const newIngredients = [...prevIngredients];
      newIngredients[index] = value;
      return newIngredients;
    });
  };

  const addIngredient = () => {
    setIngredients((prevIngredients) => [...prevIngredients, ""]);
  };

  const resizeFile = async (file) => {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        500,
        500,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(dataURLtoFile(uri, `{recipeName}.jpg`));
        },
        "base64"
      );
    });
  };

  const dataURLtoFile = (dataURL, filename) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitState) {
      return;
    }

    setSubmitState(true);
    setSubmissionState(false);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      };

      const resizedImage = await resizeFile(image);

      const formDataWithImage = new FormData();
      formDataWithImage.append("name", recipeName);
      formDataWithImage.append("description", recipeDescription);
      formDataWithImage.append("user", id);
      formDataWithImage.append("image", resizedImage);
      formDataWithImage.append("ingredients", JSON.stringify(ingredients));
      formDataWithImage.append("steps", JSON.stringify(steps));

      await axios.post(
        "http://127.0.0.1:8000/recipe/add-recipe/",
        formDataWithImage,
        {
          headers: headers,
        }
      );
      setSubmitState(false);
      setSubmissionState(true);

      setRecipeName("");
      setImage(null);
      setSteps([""]);
      setIngredients([""]);
      setSubmissionState(true);
    } catch (error) {
      console.error("Error submitting report data:", error);
      setSubmitState(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center my-4 ">
      {isLoggedIn ? (
        <div className="col-lg-6">
          <h1 className="display-4 text-center">Add recipe</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <h1 className="display-6">Recipe Name</h1>
              <input
                value={recipeName}
                onChange={(event) => setRecipeName(event.target.value)}
                placeholder={"Enter Name"}
                className="form-control py-3"
              />
            </div>
            <div className="mb-3">
              <h1 className="display-6">Description</h1>
              <input
                type="text"
                value={recipeDescription}
                onChange={handleChange}
                maxLength={100}
                className="form-control py-3"
              />
              {100 - recipeDescription.length <= 30 ? (
                <p className="text-danger">
                  {100 - recipeDescription.length}/100
                </p>
              ) : (
                <p className="text-success">
                  {100 - recipeDescription.length}/100
                </p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label display-6">
                Image
              </label>
              <input
                type="file"
                className="form-control"
                id="photo"
                name="image"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
            </div>
            <div className="mb-3">
              <h1 className="display-6">Add Recipe Steps</h1>
              {steps.map((step, index) => (
                <div key={index} className="mb-2 row align-items-center">
                  <div className="col-10">
                    <input
                      value={step}
                      onChange={(event) => handleStepChange(event, index)}
                      placeholder={`Step ${index + 1}`}
                      className="form-control py-3"
                    />
                  </div>
                  <div className="col-2">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm px-5"
                      onClick={() => removeStep(index)}
                    >
                      Remove Step
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={addStep}
                className="btn btn-primary mt-2"
                type="button"
              >
                Add Step
              </button>
            </div>
            <div className="mb-3">
              <h1 className="display-6">Add Ingredients</h1>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="mb-2 row align-items-center">
                  <div className="col-10 ">
                    <input
                      value={ingredient}
                      onChange={(event) => handleIngredientChange(event, index)}
                      placeholder={`Ingredient ${index + 1}`}
                      className="form-control py-3"
                    />
                  </div>
                  <div className="col-2">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm px-5"
                      onClick={() => removeIngredient(index)}
                    >
                      Remove Ingredient
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={addIngredient}
                type="button"
                className="btn btn-primary mt-2"
              >
                Add Ingredient
              </button>
            </div>
            <button type="submit" className="btn btn-primary text-center">
              Submit
            </button>
          </form>
          {submitState && (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
          {submissionState && (
            <h1 className="display-6 text-center">Recipe Added Successful</h1>
          )}
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

export default ReportForm;
