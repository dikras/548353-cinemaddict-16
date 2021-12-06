import AbstractView from './abstract.js';

const createMoviesCountTemplate = (movies) => (
  `<p>${movies.length} movies inside</p>
  `
);

export default class MoviesCountView extends AbstractView {
  #movies = null;

  constructor(movies) {
    super();
    this.#movies = movies;
  }

  get template() {
    return createMoviesCountTemplate(this.#movies);
  }
}
