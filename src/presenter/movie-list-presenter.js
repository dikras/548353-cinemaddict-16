import MovieListView from '../view/movie-list-view.js';
import MovieListContainerView from '../view/movie-list-container-view.js';
import NoMoviesView from '../view/no-movies-view.js';
import SortView from '../view/sort-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import MoviePresenter from './movie-presenter.js';
import { MovieCount, SortType, UpdateType, UserAction, FilterType, PopupViewState } from '../const.js';
import { RenderPosition, render, remove } from '../utils/render.js';
import { sortByDate, sortByRating } from '../utils/movie.js';
import { filter } from '../utils/filter.js';
import LoadingView from '../view/loading-view.js';
import MoviesCountView from '../view/movies-count-view.js';


export default class MovieListPresenter {
  #movieListContainer = null;
  #moviesModel = null;
  #filterModel = null;
  #commentsModel = null;
  #noMoviesComponent = null;
  #moviesCountComponent = null;
  #movieListComponent = null;
  #movieListElement = null;

  #movieListContainerComponent = new MovieListContainerView();
  #loadingComponent = new LoadingView();
  #sortComponent = null;
  #showMoreButtonComponent = null;

  #movieListContainerElement = this.#movieListContainerComponent.element;

  #renderedMoviesCount = MovieCount.PER_STEP;
  #moviePresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  constructor(movieListContainer, moviesModel, filterModel, commentsModel) {
    this.#movieListContainer = movieListContainer;
    this.#moviesModel = moviesModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;
  }

  get movies() {
    this.#filterType = this.#filterModel.filter;
    const movies = [...this.#moviesModel.movies];
    const filteredMovies = filter[this.#filterType](movies);

    switch (this.#currentSortType) {
      case SortType.BY_DATE:
        return filteredMovies.sort(sortByDate);
      case SortType.BY_RATING:
        return filteredMovies.sort(sortByRating);
    }

    return filteredMovies;
  }

  destroy = () => {
    this.#clearBoard({resetRenderedMoviesCount: true, resetSortType: true});

    remove(this.#movieListComponent);

    this.#moviesModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  init = () => {
    this.#movieListComponent = new MovieListView();
    this.#movieListElement = this.#movieListComponent.element;
    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#moviePresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = async (actionType, updateType, update, movie, commentsModel) => {
    switch(actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#moviesModel.updateMovie(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#moviePresenter.get(movie.id).setViewState(PopupViewState.DELETING);
        try {
          await commentsModel.deleteComment(updateType, update);
        } catch(err) {
          this.#moviePresenter.get(movie.id).setViewState(PopupViewState.ABORTING_DELETE);
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#moviePresenter.get(movie.id).setViewState(PopupViewState.SAVING);
        try {
          await commentsModel.addComment(updateType, update, movie);
        } catch(err) {
          this.#moviePresenter.get(movie.id).setViewState(PopupViewState.ABORTING_SAVE);
        }
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.MINOR:
        this.#moviePresenter.get(data.id).init(data);
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedMoviesCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        this.#renderMoviesCount();
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedMoviesCount: true});
    this.#renderBoard();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#movieListContainer, this.#sortComponent, RenderPosition.BEFOREEND);
  }

  #renderMovieList = () => {
    render(this.#movieListContainer, this.#movieListElement, RenderPosition.BEFOREEND);
  }

  #renderMovieListContainer = () => {
    render(this.#movieListElement, this.#movieListContainerElement, RenderPosition.BEFOREEND);
  }

  #renderMovie = (movie) => {
    const moviePresenter = new MoviePresenter(this.#movieListContainerComponent.element, this.#handleViewAction, this.#handleModeChange, this.#commentsModel);
    moviePresenter.init(movie);
    this.#moviePresenter.set(movie.id, moviePresenter);
  }

  #renderMovies = (movies) => {
    movies.forEach((movie) => this.#renderMovie(movie));
  }

  #renderLoading = () => {
    render(this.#movieListElement, this.#loadingComponent, RenderPosition.BEFOREEND);
  }

  #renderNoMovies = () => {
    this.#noMoviesComponent = new NoMoviesView(this.#filterType);
    render(this.#movieListElement, this.#noMoviesComponent, RenderPosition.BEFOREEND);
  }

  #handleShowMoreButtonClick = () => {
    const moviesCount = this.movies.length;
    const newRenderedMoviesCount = Math.min(moviesCount, this.#renderedMoviesCount + MovieCount.PER_STEP);
    const movies = this.movies.slice(this.#renderedMoviesCount, newRenderedMoviesCount);

    this.#renderMovies(movies);
    this.#renderedMoviesCount = newRenderedMoviesCount;

    if (this.#renderedMoviesCount >= moviesCount) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setShowMoreButtonClickHandler(this.#handleShowMoreButtonClick);

    render(this.#movieListComponent.element, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  #renderMoviesCount = () => {
    this.#moviesCountComponent = new MoviesCountView(this.#moviesModel.movies);
    const footerElement = document.querySelector('.footer');
    render(footerElement, this.#moviesCountComponent.element, RenderPosition.BEFOREEND);
  }

  #clearBoard = ({resetRenderedMoviesCount = false, resetSortType = false} = {}) => {
    const moviesCount = this.movies.length;

    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#noMoviesComponent);
    remove(this.#showMoreButtonComponent);

    if (this.#noMoviesComponent) {
      remove(this.#noMoviesComponent);
    }

    if (resetRenderedMoviesCount) {
      this.#renderedMoviesCount = MovieCount.PER_STEP;
    } else {
      this.#renderedMoviesCount = Math.min(moviesCount, this.#renderedMoviesCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const movies = this.movies;
    const moviesCount = movies.length;

    if (moviesCount === 0) {
      this.#renderNoMovies();
    } else {
      this.#renderSort();
    }

    this.#renderMovieList();
    this.#renderMovieListContainer();
    this.#renderMovies(movies.slice(0, Math.min(moviesCount, this.#renderedMoviesCount)));

    if (moviesCount > MovieCount.PER_STEP) {
      this.#renderShowMoreButton();
    }
  }
}
