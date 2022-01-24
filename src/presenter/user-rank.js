import UserRankView from '../view/user-rank.js';
import { RenderPosition, render, replace, remove } from '../utils/render.js';

export default class UserRankPresenter {
  #userRankContainer = null;
  #userRankComponent = null;
  #moviesModel = null;

  constructor(userRankContainer, moviesModel) {
    this.#userRankContainer = userRankContainer;
    this.#moviesModel = moviesModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const prevUserRankComponent = this.#userRankComponent;

    this.#userRankComponent = new UserRankView(this.#moviesModel.movies);
    if (prevUserRankComponent === null) {
      render(this.#userRankContainer, this.#userRankComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#userRankComponent, prevUserRankComponent);
    remove(prevUserRankComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }
}
