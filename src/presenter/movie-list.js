import MovieListView from '../view/movie-list.js';
import NoMoviesView from '../view/no-movies.js';
import SortView from '../view/sort.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import MoviePresenter from './movie.js';
import { MovieCount, SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { RenderPosition, render, remove } from '../utils/render.js';
import { sortByDate, sortByRating } from '../utils/movie.js';
import { filter } from '../utils/filter.js';

export default class MovieListPresenter {
  #movieListContainer = null;
  #moviesModel = null;
  #filterModel = null;
  #noMoviesComponent = null;

  #movieListComponent = new MovieListView();
  #sortComponent = null;
  #showMoreButtonComponent = null;

  #movieListElement = this.#movieListComponent.element.querySelector('.films-list');
  #movieListContainerElement = this.#movieListComponent.element.querySelector('.films-list__container');

  #renderedMoviesCount = MovieCount.PER_STEP;
  #moviePresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  constructor(movieListContainer, moviesModel, filterModel) {
    this.#movieListContainer = movieListContainer;
    this.#moviesModel = moviesModel;
    this.#filterModel = filterModel;
  }

  get movies() {
    this.#filterType = this.#filterModel.filter;
    const movies = this.#moviesModel.movies;
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
    remove(this.#sortComponent);

    this.#moviesModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  init = () => {

    render(this.#movieListContainer, this.#movieListComponent, RenderPosition.BEFOREEND);
    render(this.#movieListElement, this.#movieListContainerElement, RenderPosition.BEFOREEND);

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#moviePresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = (actionType, updateType, update, commentsModel) => {
    switch(actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#moviesModel.updateMovie(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        commentsModel.deleteComment(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        commentsModel.addComment(updateType, update);
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

    render(this.#movieListComponent, this.#sortComponent, RenderPosition.AFTERBEGIN);
  }

  #renderMovie = (movie) => {
    const moviePresenter = new MoviePresenter(this.#movieListContainerElement, this.#handleViewAction, this.#handleModeChange);
    moviePresenter.init(movie);
    this.#moviePresenter.set(movie.id, moviePresenter);
  }

  #renderMovies = (movies) => {
    movies.forEach((movie) => this.#renderMovie(movie));
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

    render(this.#movieListElement, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  #clearBoard = ({resetRenderedMoviesCount = false, resetSortType = false} = {}) => {
    const moviesCount = this.movies.length;

    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();

    remove(this.#sortComponent);
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
    const movies = this.movies;
    const moviesCount = movies.length;

    if (moviesCount === 0) {
      this.#renderNoMovies();
    } else {
      this.#renderSort();
    }

    this.#renderMovies(movies.slice(0, Math.min(moviesCount, this.#renderedMoviesCount)));

    if (moviesCount > MovieCount.PER_STEP) {
      this.#renderShowMoreButton();
    }
  }
}
