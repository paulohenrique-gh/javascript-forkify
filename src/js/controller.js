import * as model from './model.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // Loading recipe
    await model.loadRecipe(id);

    // Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function() {
  try {
    resultsView.renderSpinner();

    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // Load results
    await model.loadSearchResults(query);
    
    // Render results
    resultsView.render(model.getSearchResultsPage());

    // Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function(pageNum) {
  // render new results
  resultsView.render(model.getSearchResultsPage(pageNum));

  // render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function(newServings) {
  // update the recipe servings in state
  model.updateServings(newServings);

  // update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function() {
  // add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  }
  else {
    model.deleteBookmark(model.state.recipe.id)
  }

  // update recipe view
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const init = function() {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
}
init();