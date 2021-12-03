import AbstractView from './abstract.js';

const createStatsLinkTemplate = () => (
  `<a href="#stats" class="main-navigation__additional">Stats</a>
  `
);

export default class StatsLinkView  extends AbstractView {
  get template() {
    return createStatsLinkTemplate();
  }
}
