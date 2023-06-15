import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const SharedRecipe = () => {
  const recipe_id = useParams();
  const [specificRecipe, setRecipe] = useState([]);

  useEffect(() => {
    const getRecipe = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        };

        const response = await axios.get(
          `http://127.0.0.1:8000/recipe/get-specific-recipe/${recipe_id.recipe_id}`,
          { headers: headers }
        );

        setRecipe(response.data);
      } catch (e) {
        console.log("error", e);
      }
    };
    getRecipe();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="text-center container">
      {specificRecipe.length > 0 ? (
        <div>
          <h1 className="display-3">{specificRecipe[0].name}</h1>

          {specificRecipe.map((recipe) => (
            <div>
              <img
                src={`http://127.0.0.1:8000${recipe.image}`}
                alt={recipe.name}
                className="border border-2 rounded-2"
                style={{
                  maxWidth: 500,
                  maxHeight: 350,
                  minWidth: 400,
                  minHeight: 300,
                }}
              ></img>

              <h6 className="display-6">Provided by {recipe.user}</h6>
              <hr />
              <div className="row">
                <div className="col-6">
                  <h3 className="display-6">Ingredients</h3>
                  <ol>
                    {recipe.ingredients.map((ingredient) => (
                      <li className="text-start"> {ingredient}</li>
                    ))}
                  </ol>
                </div>
                <div className="col-6">
                  <h3 className="display-6">Instructions</h3>
                  <ol>
                    {recipe.steps.map((step) => (
                      <li className="text-start"> {step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h1>...loading</h1>
      )}
    </div>
  );
};

export default SharedRecipe;
