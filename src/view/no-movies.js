import { createElement } from '../render.js';

const createNoMoviesTemplate = () => (
  `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title">There are no movies in our database</h2>
      </section>
    </section>
  `
);

export default class NoMoviesView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createNoMoviesTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
