import React, { useState, useEffect } from "react";
import axios from "axios";
import loginState from "../Custom Hooks/loginState";
import Resizer from "react-image-file-resizer";
import { Link, useParams } from "react-router-dom";
import getUser from "../Custom Hooks/getUser";

const ReportForm = () => {
  // eslint-disable-next-line
  const { name, email, id } = getUser();
  const [image, setImage] = useState(null);
  const isLoggedIn = loginState();
  const [submitState, setSubmitState] = useState(false);
  const [submitAlertState, setSubmitAlertState] = useState(false);
  const [submissionState, setSubmissionState] = useState(false);
  const [steps, setSteps] = useState([""]);
  const [ingredients, setIngredients] = useState([""]);
  const [recipeName, setRecipeName] = useState("");
  const recipe_id = useParams();
  const [cimage, setCimage] = useState(null);

  console.log("id", recipe_id.recipe_id);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(
          `http://127.0.0.1:8000/recipe/get-specific-recipe/${recipe_id.recipe_id}`,
          {
            headers: headers,
          }
        );
        console.log(response.data);
        setIngredients(response.data[0].ingredients);
        setSteps(response.data[0].steps);
        setRecipeName(response.data[0].name);
        setImage(response.data[0].image);
        setCimage(response.data[0].image);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRecipe();
  }, [recipe_id]);

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
      let inputFileType;
      if (file instanceof Blob) {
        inputFileType = file.type;
      } else if (file instanceof File) {
        inputFileType = file.type;
      } else {
        resolve(null);
      }

      Resizer.imageFileResizer(
        file,
        500,
        500,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(dataURLtoFile(uri, "image.jpg"));
        },
        "base64",
        500,
        500,
        inputFileType
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

      const resizedImage = image ? await resizeFile(image) : null;

      const formDataWithImage = new FormData();
      formDataWithImage.append("recipe_id", recipe_id.recipe_id);
      formDataWithImage.append("name", recipeName);
      formDataWithImage.append("user", id);
      if (resizedImage) {
        formDataWithImage.append("image", resizedImage);
      }
      formDataWithImage.append("ingredients", JSON.stringify(ingredients));
      formDataWithImage.append("steps", JSON.stringify(steps));

      await axios.patch(
        `http://127.0.0.1:8000/recipe/update-recipe/`,
        formDataWithImage,
        {
          headers: headers,
        }
      );

      setTimeout(() => {
        setSubmitState(false);
        setSubmissionState(true);
        setTimeout(() => {
          window.location.reload(true);
        }, 500);
      }, 1000);
    } catch (error) {
      console.error("Error submitting report data:", error);
      setSubmitState(false);
    }
  };

  const alertState = (e) => setSubmitAlertState(true);

  return (
    <div className="container d-flex justify-content-center my-4 ">
      {isLoggedIn ? (
        <div className="col-lg-6">
          <h1 className="display-4 text-center">Update Recipe</h1>
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
              <img
                src={`http://127.0.0.1:8000/${cimage}`}
                alt={recipeName}
                className="img-thumbnail m-2"
                height={200}
                width={200}
              ></img>
              <input
                type="file"
                className="form-control"
                id="photo"
                name="image"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="mb-3">
              <h1 className="display-6">Recipe Steps</h1>
              {steps &&
                steps.map((step, index) => (
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
              <h1 className="display-6">Ingredients</h1>
              {ingredients &&
                ingredients.map((ingredient, index) => (
                  <div key={index} className="mb-2 row align-items-center">
                    <div className="col-10 ">
                      <input
                        value={ingredient}
                        onChange={(event) =>
                          handleIngredientChange(event, index)
                        }
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
            {submitAlertState ? (
              <div className="alert alert-warning container" role="alert">
                Are you sure you want to edit? To edit click confirm
                <button
                  type="submit"
                  className="btn btn-warning text-center ms-5"
                >
                  Confirm
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-warning text-center px-5 py-3 "
                onClick={alertState}
              >
                Submit
              </button>
            )}
          </form>
          {submitState && (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
          {submissionState && (
            <div>
              <h1 className="display-6 text-center">
                Recipe Edited Successful
              </h1>
            </div>
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
