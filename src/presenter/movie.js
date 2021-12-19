import MovieCardView from '../view/movie-card.js';
import PopupView from '../view/popup.js';
import { RenderPosition, render, replace, remove } from '../utils/render.js';
import { Mode } from '../const.js';

const bodyElement = document.body;

export default class MoviePresenter {
  #movieListContainer = null;

  #movieComponent = null;
  #popupComponent = null;

  #changeData = null;
  #changeMode = null;

  #movie = null;
  #mode = Mode.DEFAULT;

  constructor(movieListContainer, changeData, changeMode) {
    this.#movieListContainer = movieListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (movie) => {
    this.#movie = movie;

    const prevMovieComponent = this.#movieComponent;
    this.#movieComponent = new MovieCardView(movie);

    this.#movieComponent.setCardClickHandler(this.#handleCardClick);
    this.#movieComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#movieComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#movieComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevMovieComponent === null) {
      render(this.#movieListContainer, this.#movieComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#movieListContainer.contains(prevMovieComponent.element)) {
      replace(this.#movieComponent, prevMovieComponent);
    }

    remove(prevMovieComponent);
  }

  #renderPopup = (movie) => {
    this.#popupComponent = new PopupView(movie);

    bodyElement.appendChild(this.#popupComponent.element);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    bodyElement.classList.add('hide-overflow');

    this.#popupComponent.setCloseButtonClickHandler(this.#handleCloseButtonClick);
    this.#popupComponent.setWatchlistPopupClickHandler(this.#handleWatchlistClick);
    this.#popupComponent.setAlreadyWatchedPopupClickHandler(this.#handleAlreadyWatchedClick);
    this.#popupComponent.setFavoritePopupClickHandler(this.#handleFavoriteClick);

    this.#changeMode();
    this.#mode = Mode.DETAILS;
  }

  destroy = () => {
    remove(this.#movieComponent);
  }

  #handleCardClick = () => {
    this.#renderPopup(this.#movie);
  }

  #closePopup = () => {
    bodyElement.removeChild(this.#popupComponent.element);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    bodyElement.classList.remove('hide-overflow');

    this.#mode = Mode.DEFAULT;
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closePopup();
    }
  }

  #handleCloseButtonClick = () => {
    this.#closePopup();
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
    }
  }

  #handlePopupControlClick = (movieProperty) => {
    this.#changeData(
      Object.assign(
        {},
        this.#movie,
        this.#movie.userDetails[movieProperty] = !this.#movie.userDetails[movieProperty],
      ));
    if (this.#popupComponent) {
      const currentPosition = this.#popupComponent.element.scrollTop;
      this.#closePopup();
      this.#renderPopup(this.#movie);
      this.#popupComponent.element.scrollTo(0, currentPosition);
    }
  }

  #handleWatchlistClick = () => {
    this.#handlePopupControlClick('watchlist');
  }

  #handleAlreadyWatchedClick = () => {
    this.#handlePopupControlClick('alreadyWatched');
  }

  #handleFavoriteClick = () => {
    this.#handlePopupControlClick('favorite');
  }
}
