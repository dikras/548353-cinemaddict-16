import AbstractView from './abstract.js';

const createMoviesListContainerTemplate = () => (
  `<div class="films-list__container">
  </div>
  `
);

export default class MoviesListContainerView extends AbstractView {
  get template() {
    return createMoviesListContainerTemplate();
  }
}
