import { createElement } from '../render.js';

const createMoviesListTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
  </section>
  `
);

export default class MoviesListView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMoviesListTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
