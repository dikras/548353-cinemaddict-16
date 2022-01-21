import AbstractView from './abstract.js';
import { filter } from '../utils/filter.js';
import { FilterType } from '../const.js';

const createUserRankTemplate = (movies) => {
  const watchedMoviesCount = filter[FilterType.HISTORY](movies).length;
  return `<section class="header__profile profile">
    <p class="profile__rating">${watchedMoviesCount}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRankView extends AbstractView {
  #movies = null;

  constructor(movies) {
    super();
    this.#movies = movies;
  }

  get template() {
    return createUserRankTemplate(this.#movies);
  }
}
