import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { AJAX } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    // 1) Get recipe data from API
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    // 2) Create recipe object
    state.recipe = createRecipeObject(data);

    // 3) Update bookmark property
    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    // 1) Store search query
    state.search.query = query;

    // 2) Get search query data from API
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    // 3) Store search results
    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    // 4) Reset search results current page in state
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  // 1) Store search results current page
  state.search.page = page;

  // 2) Calculate starting and ending array index
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  // 3) Return array portion of search results to display
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  // 1) Calculate and assign new serving quantity for each ingredient
  state.recipe.ingredients.forEach((ing) => {
    // Formula: newQuantity = oldQuantity * newServing / oldServing
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  // 2) Store new servings number
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  // Save bookmarks array to local storage
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // 1) Add recipe to bookmarks array
  state.bookmarks.push(recipe);

  // 2) Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // 3) Save updated bookmarks to local storage
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // 1) Remove recipe from bookmarks array
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);

  // 2) Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // 3) Save updated bookmarks to local storage
  persistBookmarks();
};

const init = function () {
  // Get bookmarks from local storage
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

// for debugging only to empty local storage
const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    // 1) Filter out ingredients input from form input and seperate into ingredient object
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient format! Please use the correct format :)"
          );

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // 2) Create recipe object for sending to API
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };

    // 3) Post recipe object to API
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    // 4) Create recipe object in state
    state.recipe = createRecipeObject(data);

    // 5) Mark recipe as bookmarked since it's user generated recipe
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
