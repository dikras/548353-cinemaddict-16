import MoviesListView from '../view/movies-list.js';
import MoviesListContainerView from '../view/movies-list-container.js';
import NoMoviesView from '../view/no-movies.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import MoviePresenter from './movie.js';
import { MovieCount } from '../const.js';
import { RenderPosition, render, remove } from '../render.js';
import { updateItem } from '../utils.js';

export default class MoviesListPresenter {
  #moviesListContainer = null;

  #moviesListComponent = new MoviesListView();
  #moviesListContainerComponent = new MoviesListContainerView();
  #noMoviesComponent = new NoMoviesView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #movies = [];
  #renderedMoviesCount = MovieCount.PER_STEP;
  #moviePresenter = new Map();

  constructor(moviesListContainer) {
    this.#moviesListContainer = moviesListContainer;

  }

  init(movies) {
    this.#movies = [...movies];

    render(this.#moviesListContainer, this.#moviesListComponent, RenderPosition.BEFOREEND);
    render(this.#moviesListComponent, this.#moviesListContainerComponent, RenderPosition.BEFOREEND);

    this.#renderMoviesList();
  }

  #handleModeChange = () => {
    this.#moviePresenter.forEach((presenter) => presenter.resetView());
  }

  #handleMovieChange = (updatedMovie) => {
    this.#movies = updateItem(this.#movies, updatedMovie);
    this.#moviePresenter.get(updatedMovie.id).init(updatedMovie);
  }

  #renderMovie = (movie) => {
    const moviePresenter = new MoviePresenter(this.#moviesListContainerComponent, this.#handleMovieChange, this.#handleModeChange);
    moviePresenter.init(movie);
    this.#moviePresenter.set(movie.id, moviePresenter);
  }

  #renderMovies = (from, to) => {
    this.#movies.slice(from, to).forEach((movie) => this.#renderMovie(movie));
  }

  #renderNoMovies = () => {
    render(this.#moviesListContainerComponent, this.#noMoviesComponent, RenderPosition.BEFOREEND);
  }

  #handleShowMoreButtonClick = () => {
    this.#renderMovies(this.#renderedMoviesCount, this.#renderedMoviesCount + MovieCount.PER_STEP);
    this.#renderedMoviesCount += MovieCount.PER_STEP;

    if (this.#renderedMoviesCount >= this.#movies.length) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    render(this.#moviesListComponent, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);

    this.#showMoreButtonComponent.setShowMoreButtonClickHandler(this.#handleShowMoreButtonClick);
  }

  #renderMoviesList = () => {
    if (this.#movies.length === 0) {
      this.#renderNoMovies();
      return;
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
    remove(this.#showMoreButtonComponent);
  }
}
