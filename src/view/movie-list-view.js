import Abstract from './abstract.js';

const createMovieListTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>
  </section>
  `
);

export default class MovieListView extends Abstract {
  get template() {
    return createMovieListTemplate();
  }
}
