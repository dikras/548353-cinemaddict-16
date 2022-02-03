import Abstract from './abstract.js';

const createMovieListContainerTemplate = () => (
  `<div class="films-list__container">
    </div>
  `
);

export default class MovieListContainerView extends Abstract {
  get template() {
    return createMovieListContainerTemplate();
  }
}
