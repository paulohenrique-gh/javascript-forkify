import * as model from './model.js'
import recipeView from './views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // Loading recipe
    await model.loadRecipe(id);

    // Rendering recipe
    recipeView.render(model.state.recipe);

  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const init = function() {
  recipeView.addHanderRender(controlRecipes);
}
init();