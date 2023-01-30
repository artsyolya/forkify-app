import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    // 0) Display loading spinner
    recipeView.renderSpinner();

    // 1) Update result view to mark selected recipe
    resultsView.update(model.getSearchResultsPage());

    // 2) Update bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 3) Loading recipe
    await model.loadRecipe(id);

    // 4) Display recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 0) Display loading spinner
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1) Update the recipe servings in state
  model.updateServings(newServings);

  // 2) Update servings in recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  // Render bookmarks on page load
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipeForm = function () {
  // Display recipe form
  addRecipeView.renderForm();
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // 0) Show loading spinner
    addRecipeView.renderSpinner();

    // 1) Upload recipe
    await model.uploadRecipe(newRecipe);

    // 2) Render recipe
    recipeView.render(model.state.recipe);

    // 3) Display success message
    addRecipeView.removeUploadGrid();
    addRecipeView.renderMessage();

    // 4) Render bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // 5) Change ID in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // 6) Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    // 7) Update bookmarks view to highlight current recipe
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    console.error("💥💥💥", err);
    addRecipeView.removeUploadGrid();
    addRecipeView.renderError(err.message);
  }
};

/**
 * Activate all event handlers on page load with Publisher-Subscriber pattern
 */
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerShowWindow(controlAddRecipeForm);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
