import UserRankView from '../view/user-rank.js';
import { RenderPosition, render, replace, remove } from '../utils/render.js';

export default class UserRankPresenter {
  #headerContainer = null;
  #movies = null;

  #userRankComponent = null;

  constructor(movies) {
    this.#movies = movies;
  }

  get component() {
    return this.#userRankComponent;
  }

  init = () => {
    const prevUserRankComponent = this.#userRankComponent;

    this.#headerContainer = document.querySelector('.header');
    this.#userRankComponent = new UserRankView(this.#movies);

    if (prevUserRankComponent === null) {
      render(this.#headerContainer, this.#userRankComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#userRankComponent, prevUserRankComponent);
    remove(prevUserRankComponent);
  }
}
