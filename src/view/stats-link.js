import AbstractView from './abstract.js';
import { FilterType } from '../const.js';

const createStatsLinkTemplate = () => (
  `<a href="#stats" class="main-navigation__additional" data-filter-type="${FilterType.STATISTICS}">Stats</a>
  `
);

export default class StatsLinkView  extends AbstractView {
  get template() {
    return createStatsLinkTemplate();
  }
}
