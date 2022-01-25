import AbstractView from './abstract';

const createNoMoviesTemplate = () => (
  `<h2 class="films-list__title">
    Loading...
  </h2>`
);

export default class LoadingView extends AbstractView {
  get template() {
    return createNoMoviesTemplate();
  }
}
