import { createElement } from '../render.js';

const createMainNavigationTemplate = () => (
  `<nav class="main-navigation">
  </nav>`
);

export default class MainNavigationView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMainNavigationTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
