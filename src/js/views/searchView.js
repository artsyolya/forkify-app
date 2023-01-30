import View from "./View.js";

class SearchView extends View {
  _parentElement = document.querySelector(".search");

  /**
   * Captures user search input
   * @returns {string}
   * @this {Object} View instance
   */
  getQuery() {
    const query = this._parentElement.querySelector(".search__field").value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector(".search__field").value = "";
  }

  /**
   * Handles event listener for the search form
   * @param {function} handler Using Publisher-Subscriber pattern, pass in controller function to execute inside event listener's callback function
   * @this {Object} View instance
   */
  addHandlerSearch(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
