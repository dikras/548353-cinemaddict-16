import MovieListView from '../view/movie-list.js';
import NoMoviesView from '../view/no-movies.js';
import SortView from '../view/sort.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import MoviePresenter from './movie.js';
import { MovieCount, SortType } from '../const.js';
import { RenderPosition, render, remove } from '../utils/render.js';
import { updateItem } from '../utils/common.js';
import { sortByDate, sortByRating } from '../utils/movie.js';

export default class MovieListPresenter {
  #movieListContainer = null;
  #sortComponent = null;

  #movieListComponent = new MovieListView();
  #noMoviesComponent = new NoMoviesView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #movieListElement = this.#movieListComponent.element.querySelector('.films-list');
  #movieListContainerElement = this.#movieListComponent.element.querySelector('.films-list__container');

  #movies = [];
  #renderedMoviesCount = MovieCount.PER_STEP;
  #moviePresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #initialMovies = [];

  constructor(movieListContainer) {
    this.#movieListContainer = movieListContainer;
  }

  init(movies) {
    this.#movies = [...movies];
    this.#initialMovies = [...movies];

    render(this.#movieListContainer, this.#movieListComponent, RenderPosition.BEFOREEND);
    render(this.#movieListElement, this.#movieListContainerElement, RenderPosition.BEFOREEND);

    this.#renderMoviesList();
  }

  #handleModeChange = () => {
    this.#moviePresenter.forEach((presenter) => presenter.resetView());
  }

  #handleMovieChange = (updatedMovie) => {
    this.#movies = updateItem(this.#movies, updatedMovie);
    this.#initialMovies = updateItem(this.#initialMovies, updatedMovie);
    this.#moviePresenter.get(updatedMovie.id).init(updatedMovie);
  }

  #sortMovies = (sortType) => {
    switch (sortType) {
      case SortType.BY_DATE:
        this.#movies.sort(sortByDate);
        break;
      case SortType.BY_RATING:
        this.#movies.sort(sortByRating);
        break;
      default:
        this.#movies = [...this.#initialMovies];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortMovies(sortType);
    this.#clearMovieList();
    this.#renderMoviesList();
  }

  #renderMovie = (movie) => {
    const moviePresenter = new MoviePresenter(this.#movieListContainerElement, this.#handleMovieChange, this.#handleModeChange);
    moviePresenter.init(movie);
    this.#moviePresenter.set(movie.id, moviePresenter);
  }

  #renderMovies = (from, to) => {
    this.#movies.slice(from, to).forEach((movie) => this.#renderMovie(movie));
  }


  #renderNoMovies = () => {
    render(this.#movieListElement, this.#noMoviesComponent, RenderPosition.BEFOREEND);
  }

  #handleShowMoreButtonClick = () => {
    this.#renderMovies(this.#renderedMoviesCount, this.#renderedMoviesCount + MovieCount.PER_STEP);
    this.#renderedMoviesCount += MovieCount.PER_STEP;

    if (this.#renderedMoviesCount >= this.#movies.length) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    render(this.#movieListElement, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);

    this.#showMoreButtonComponent.setShowMoreButtonClickHandler(this.#handleShowMoreButtonClick);
  }

  #renderMoviesList = () => {
    if (this.#movies.length === 0) {
      this.#renderNoMovies();
    } else {
      this.#sortComponent = new SortView(this.#currentSortType);
      render(this.#movieListComponent, this.#sortComponent, RenderPosition.AFTERBEGIN);
      this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    }

    this.#renderMovies(0, Math.min(this.#movies.length, MovieCount.PER_STEP));

    if (this.#movies.length > MovieCount.PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #clearMovieList = () => {
    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();
    this.#renderedMoviesCount = MovieCount.PER_STEP;
    remove(this.#sortComponent);
    remove(this.#showMoreButtonComponent);
  }
}
