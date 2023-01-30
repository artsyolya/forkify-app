import View from "./View.js";
import icons from "url:../../img/icons.svg";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");

  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  _message = "Recipe was successfully uploaded :)";

  constructor() {
    super();
    this._addHandlerHideWindow();
  }

  /**
   * Render add recipe form to the DOM
   * @this {Object} View instance
   */
  renderForm() {
    const markup = this._generateMarkup();

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  addUploadGrid() {
    this._parentElement.classList.add("upload__grid");
  }

  removeUploadGrid() {
    this._parentElement.classList.remove("upload__grid");
  }

  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  /**
   * Handle event listener to display form when the add recipe button is clicked
   * @param {function} handler Using Publisher-Subscriber pattern, pass in controller function to execute inside event listener's callback function
   * @this {Object} View instance
   */
  addHandlerShowWindow(handler) {
    this._btnOpen.addEventListener(
      "click",
      function () {
        this.toggleWindow();
        this.addUploadGrid();

        handler();
      }.bind(this)
    );
  }

  /**
   * Handle event listener to hide add recipe window
   * @this {Object} View instance
   */
  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  /**
   * Handle event listener to capture user input on the recipe form
   * @param {function} handler Using Publisher-Subscriber pattern, pass in controller function to execute inside event listener's callback function
   * @this {Object} View instance
   */
  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();

      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  /**
   * Generate form markup for the DOM
   * @returns {string} DOM markup string
   */
  _generateMarkup() {
    return `
          <div class="upload__column">
            <h3 class="upload__heading">Recipe data</h3>
            <label>Title</label>
            <input required name="title" type="text" />
            <label>URL</label>
            <input required name="sourceUrl" type="text" />
            <label>Image URL</label>
            <input required name="image" type="text" />
            <label>Publisher</label>
            <input required name="publisher" type="text" />
            <label>Prep time</label>
            <input required name="cookingTime" type="number" />
            <label>Servings</label>
            <input required name="servings" type="number" />
          </div>

          <div class="upload__column">
            <h3 class="upload__heading">Ingredients</h3>
            <label>Ingredient 1</label>
            <input
              type="text"
              required
              name="ingredient-1"
              placeholder="Format: 'Quantity,Unit,Description'"
            />
            <label>Ingredient 2</label>
            <input
              type="text"
              name="ingredient-2"
              placeholder="Format: 'Quantity,Unit,Description'"
            />
            <label>Ingredient 3</label>
            <input
              type="text"
              name="ingredient-3"
              placeholder="Format: 'Quantity,Unit,Description'"
            />
            <label>Ingredient 4</label>
            <input
              type="text"
              name="ingredient-4"
              placeholder="Format: 'Quantity,Unit,Description'"
            />
            <label>Ingredient 5</label>
            <input
              type="text"
              name="ingredient-5"
              placeholder="Format: 'Quantity,Unit,Description'"
            />
            <label>Ingredient 6</label>
            <input
              type="text"
              name="ingredient-6"
              placeholder="Format: 'Quantity,Unit,Description'"
            />
          </div>

          <button class="btn upload__btn">
            <svg>
              <use href="${icons}#icon-upload-cloud"></use>
            </svg>
            <span>Upload</span>
          </button>
    `;
  }
}

export default new AddRecipeView();
