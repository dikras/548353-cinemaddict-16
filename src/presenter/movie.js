import MovieCardView from '../view/movie-card.js';
import PopupView from '../view/popup.js';
import { RenderPosition, render, replace, remove } from '../utils/render.js';
import { Mode } from '../const.js';
import { UserAction, UpdateType, PopupViewState } from '../const.js';

const bodyElement = document.body;

export default class MoviePresenter {
  #movieListContainer = null;

  #movieComponent = null;
  #popupComponent = null;

  #changeData = null;
  #changeMode = null;

  #movie = null;
  #mode = Mode.DEFAULT;

  #commentsModel = null;

  constructor(movieListContainer, changeData, changeMode, commentsModel) {
    this.#movieListContainer = movieListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#commentsModel = commentsModel;
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

    if (this.#popupComponent) {
      const currentPosition = this.#popupComponent.element.scrollTop;
      remove(this.#popupComponent);
      render(bodyElement, this.#popupComponent, RenderPosition.BEFOREEND);
      this.#popupComponent.element.scrollTo(0, currentPosition);
      this.#popupComponent.restoreHandlers();
    }
  }

  #renderPopup = async (movie, commentsModel) => {
    await commentsModel.init(movie);
    const comments = commentsModel.comments;
    this.#popupComponent = new PopupView(movie, comments);

    bodyElement.appendChild(this.#popupComponent.element);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    bodyElement.classList.add('hide-overflow');

    this.#popupComponent.setCloseButtonClickHandler(this.#handleCloseButtonClick);
    this.#popupComponent.setWatchlistPopupClickHandler(this.#handleWatchlistClick);
    this.#popupComponent.setAlreadyWatchedPopupClickHandler(this.#handleAlreadyWatchedClick);
    this.#popupComponent.setFavoritePopupClickHandler(this.#handleFavoriteClick);
    this.#popupComponent.setCommentDeleteClickHandler(this.#handleDeleteCommentClick);
    this.#popupComponent.setKeydownCtrlEnterHandler(this.#handleAddComment);

    this.#changeMode();
    this.#mode = Mode.DETAILS;

    commentsModel.addObserver(this.#updatePopup);
  }

  #updatePopup = () => {
    const currentPosition = this.#popupComponent.element.scrollTop;
    this.#popupComponent.updateData({
      comments: this.#commentsModel.comments,
      newComment: {
        emotion: '',
        userComment: '',
      },
      isDisabled: false,
      isDeleting: false
    });
    this.#popupComponent.element.scrollTo(0, currentPosition);
  }

  destroy = () => {
    remove(this.#movieComponent);
    this.#commentsModel.removeObserver(this.#updatePopup);
  }

  #handleCardClick = () => {
    this.#renderPopup(this.#movie, this.#commentsModel);
  }

  #closePopup = () => {
    remove(this.#popupComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    bodyElement.classList.remove('hide-overflow');

    this.#mode = Mode.DEFAULT;
    this.#popupComponent = null;
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

  #handleControlButtonClick = (movieProperty) => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      Object.assign(
        {},
        this.#movie,
        this.#movie.userDetails[movieProperty] = !this.#movie.userDetails[movieProperty],
      ));
  }

  #handleWatchlistClick = () => {
    this.#handleControlButtonClick('watchlist');
  }

  #handleAlreadyWatchedClick = () => {
    this.#handleControlButtonClick('alreadyWatched');
  }

  #handleFavoriteClick = () => {
    this.#handleControlButtonClick('favorite');
  }

  #handleDeleteCommentClick = (comment) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      comment,
      this.#movie,
      this.#commentsModel
    );
  }

  #handleAddComment = (comment) => {
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      comment,
      this.#movie,
      this.#commentsModel
    );
  }

  #removeDisabledState = () => {
    this.#popupComponent.updateData({
      isDisabled: false,
    });
  }

  setViewState = (state) => {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }

    const currentPosition = this.#popupComponent.element.scrollTop;

    switch (state) {
      case PopupViewState.SAVING:
        this.#popupComponent.updateData({
          isDisabled: true
        });
        break;
      case PopupViewState.DELETING:
        this.#popupComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case PopupViewState.ABORTING_SAVE:
        this.#popupComponent.shakeCommentInput(this.#removeDisabledState);
        break;
      case PopupViewState.ABORTING_DELETE:
        this.#popupComponent.shakeCommentBlock(this.#removeDisabledState);
        break;
    }

    this.#popupComponent.element.scrollTo(0, currentPosition);
  }
}
