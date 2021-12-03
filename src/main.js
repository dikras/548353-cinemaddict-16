import { RenderPosition, render } from './render.js';
import UserRankView from './view/user-rank.js';
import MainNavigationView from './view/main-navigation.js';
import FilterView from './view/filter.js';
import StatsLinkView from './view/stats-link.js';
import SortView from './view/sort.js';
import BoardView from './view/board.js';
import MoviesListView from './view/movies-list.js';
import MoviesListContainerView from './view/movies-list-container.js';
import MovieCardView from './view/movie-card.js';
import ShowMoreButtonView from './view/show-more-button.js';
import MoviesCountView from './view/movies-count.js';
import NoMoviesView from './view/no-movies.js';
import { generateMovie } from './mock/movie.js';
import { generateFilter } from './mock/filter.js';
import PopupView from './view/popup.js';
import { MovieCount, KeyEvent } from './const.js';

const movies = Array.from({length: MovieCount.MAIN_BLOCK}, generateMovie);
const filters = generateFilter(movies);

const bodyElement = document.body;
const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

render(headerElement, new UserRankView().element, RenderPosition.BEFOREEND);
render(mainElement, new MainNavigationView().element, RenderPosition.BEFOREEND);

const mainNavigationElement = mainElement.querySelector('.main-navigation');
render(mainNavigationElement, new FilterView(filters).element, RenderPosition.BEFOREEND);
render(mainNavigationElement, new StatsLinkView().element, RenderPosition.BEFOREEND);

if (movies.length === 0) {
  render(mainElement, new NoMoviesView().element, RenderPosition.BEFOREEND);
} else {
  render(mainElement, new SortView().element, RenderPosition.BEFOREEND);
  render(mainElement, new BoardView().element, RenderPosition.BEFOREEND);

  const boardElement = mainElement.querySelector('.films');
  render(boardElement, new MoviesListView().element, RenderPosition.BEFOREEND);

  const moviesListElement = boardElement.querySelector('.films-list');
  render(moviesListElement, new MoviesListContainerView().element, RenderPosition.BEFOREEND);

  const moviesListContainerElement = moviesListElement.querySelector('.films-list__container');

  const renderMovieCard = (containerElement, movie) => {
    const movieCardComponent = new MovieCardView(movie);
    render(containerElement, movieCardComponent.element, RenderPosition.BEFOREEND);

    const popupComponent = new PopupView(movie);

    const onEscKeyDown = (evt) => {
      if (evt.key === KeyEvent.ESC_ALL_BROWSERS || evt.key === KeyEvent.ESC_IE) {
        evt.preventDefault();
        bodyElement.removeChild(popupComponent.element);
        document.removeEventListener('keydown', onEscKeyDown);
        bodyElement.classList.remove('hide-overflow');
      }
    };

    movieCardComponent.element.querySelector('.film-card__link').addEventListener('click', (evt) => {
      evt.preventDefault();
      bodyElement.appendChild(popupComponent.element);
      document.addEventListener('keydown', onEscKeyDown);
      bodyElement.classList.add('hide-overflow');
    });

    popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      bodyElement.removeChild(popupComponent.element);
      document.removeEventListener('keydown', onEscKeyDown);
      bodyElement.classList.remove('hide-overflow');
    });
  };

  for (let i = 0; i < Math.min(movies.length, MovieCount.PER_STEP); i++) {
    renderMovieCard(moviesListContainerElement, movies[i]);
  }

  if (movies.length > MovieCount.PER_STEP) {
    let renderedMovieCount = MovieCount.PER_STEP;

    render(moviesListElement, new ShowMoreButtonView().element, RenderPosition.BEFOREEND);

    const showMoreButton = moviesListElement.querySelector('.films-list__show-more');

    showMoreButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      movies
        .slice(renderedMovieCount, renderedMovieCount + MovieCount.PER_STEP)
        .forEach((movie) => renderMovieCard(moviesListContainerElement, movie));

      renderedMovieCount += MovieCount.PER_STEP;

      if (renderedMovieCount >= movies.length) {
        showMoreButton.remove();
      }
    });
  }
}

render(footerElement, new MoviesCountView(movies).element, RenderPosition.BEFOREEND);
