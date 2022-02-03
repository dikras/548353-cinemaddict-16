import Abstract from './abstract.js';

const createNoMoviesTemplate = () => (
  `<h2 class="films-list__title">
    Loading...
  </h2>`
);

export default class LoadingView extends Abstract {
  get template() {
    return createNoMoviesTemplate();
  }
}
