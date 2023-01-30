import View from "./View.js";
import previewView from "./previewView.js";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "No recipes found! Please try again. ;)";
  _message = "";

  /**
   * Generate search results list markup for the DOM
   * @returns {string} DOM markup string
   * @this {Object} View instance
   */
  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new ResultsView();
