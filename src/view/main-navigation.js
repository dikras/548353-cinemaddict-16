import AbstractView from './abstract.js';

const createMainNavigationTemplate = () => (
  `<nav class="main-navigation">
  </nav>`
);

export default class MainNavigationView extends AbstractView {
  get template() {
    return createMainNavigationTemplate();
  }

  setNavigationClickHandler = (callback) => {
    this._callback.navigationClick = callback;
    this.element.addEventListener('click', this.#navigationClickHandler);
  }

  #navigationClickHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.navigationClick(evt.target.dataset.filterType);
  }
}
