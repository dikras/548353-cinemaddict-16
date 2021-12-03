import { createElement } from '../render.js';

const createStatsLinkTemplate = () => (
  `<a href="#stats" class="main-navigation__additional">Stats</a>
  `
);

export default class StatsLinkView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createStatsLinkTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
