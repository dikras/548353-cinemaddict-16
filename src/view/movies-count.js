import { createElement } from '../render.js';

const createMoviesCountTemplate = (movies) => (
  `<p>${movies.length} movies inside</p>
  `
);

export default class MoviesCountView {
  #element = null;
  #movies = null;

  constructor(movies) {
    this.#movies = movies;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMoviesCountTemplate(this.#movies);
  }

  removeElement() {
    this.#element = null;
  }
}
