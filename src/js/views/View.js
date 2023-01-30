import icons from "url:../../img/icons.svg";

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * Update parts of the received object with changes to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @this {Object} View instance
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  /**
   * Render a loading spinner to the DOM while waiting for the main object to be rendered to the DOM
   * @this {Object} View instance
   */
  renderSpinner() {
    const markup = `
      <div class="spinner">
          <svg>
          <use href="${icons}#icon-loader"></use>
          </svg>
      </div>
      `;
    this._parentElement.innerHTML = "";
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * Render error message to the DOM
   * @param {string} [message = this._errorMessage] The message property of the Error object or class's predifined message
   * @this {Object} View instance
   */
  renderError(message = this._errorMessage) {
    const markup = `
		<div class="error">
			<div>
				<svg>
					<use href="${icons}#icon-alert-triangle"></use>
				</svg>
			</div>
			<p>${message}</p>
		</div>
	`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * Render a regular message to the DOM
   * @param {string} [message = this._message] Either pass in desired string or the class will use it's predifined message string
   * @this {Object} View instance
   */
  renderMessage(message = this._message) {
    const markup = `
		<div class="message">
			<div>
				<svg>
					<use href="${icons}#icon-smile"></use>
				</svg>
			</div>
			<p>${message}</p>
		</div>
	`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
