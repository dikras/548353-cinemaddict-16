import SmartView from './smart.js';
import { getUserRank } from '../utils/statistics.js';
import { filter } from '../utils/filter.js';
import { FilterType } from '../const.js';

const createUserRankTemplate = (movies) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${getUserRank(movies)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class UserRankView extends SmartView {
  #watchedMovies = null;;

  constructor(movies) {
    super();
    this.#watchedMovies = filter[FilterType.HISTORY](movies);
  }

  get template() {
    return createUserRankTemplate(this.#watchedMovies);
  }
}
