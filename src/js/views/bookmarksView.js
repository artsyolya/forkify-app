import View from "./View.js";
import previewView from "./previewView.js";

class BookmarksView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)";
  _message = "";

  /**
   * Handles event listener for loading bookmarks list view
   * @param {function} handler Using Publisher-Subscriber pattern, pass in controller function to execute inside event listener's callback function
   * @this {Object} View instance
   */
  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  /**
   * Generate bookmark list markup for the DOM
   * @returns {string} DOM markup string
   * @this {Object} View instance
   */
  _generateMarkup() {
    return this._data
      .map((bookmark) => previewView.render(bookmark, false))
      .join("");
  }
}

export default new BookmarksView();
