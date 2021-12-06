import AbstractView from './abstract.js';

const createMainNavigationTemplate = () => (
  `<nav class="main-navigation">
  </nav>`
);

export default class MainNavigationView extends AbstractView {
  get template() {
    return createMainNavigationTemplate();
  }
}
