import AbstractView from './abstract.js';

const createMovieListTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>
    <div class="films-list__container">
    </div>
  </section>
  `
);

export default class MovieListView extends AbstractView {
  get template() {
    return createMovieListTemplate();
  }
}