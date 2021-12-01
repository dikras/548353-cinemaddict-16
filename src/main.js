import { renderTemplate, RenderPosition } from './render.js';
import { createUserRankTemplate } from './view/user-rank.js';
import { createMainNavigationTemplate } from './view/main-navigation.js';
import { createFilterTemplate } from './view/filter.js';
import { createStatsLinkTemplate } from './view/stats-link.js';
import { createSortTemplate } from './view/sort.js';
import { createBoardTemplate } from './view/board.js';
import { createMoviesListTemplate } from './view/movies-list.js';
import { createMoviesListContainerTemplate } from './view/movies-list-container.js';
import { createMovieCardTemplate } from './view/movie-card.js';
import { createShowMoreButtonTemplate } from './view/show-more-button.js';
import { createMoviesCountTemplate } from './view/movies-count.js';
import { generateMovie } from './mock/movie.js';
import { generateFilter } from './mock/filter.js';
import { createPopupTemplate } from './view/popup.js';

const MOVIE_COUNT = 19;
const MOVIE_COUNT_PER_STEP = 5;

const movies = Array.from({length: MOVIE_COUNT}, generateMovie);
const filters = generateFilter(movies);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

renderTemplate(headerElement, createUserRankTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createMainNavigationTemplate(), RenderPosition.BEFOREEND);

const mainNavigationElement = mainElement.querySelector('.main-navigation');
renderTemplate(mainNavigationElement, createFilterTemplate(filters), RenderPosition.BEFOREEND);
renderTemplate(mainNavigationElement, createStatsLinkTemplate(), RenderPosition.BEFOREEND);

renderTemplate(mainElement, createSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createBoardTemplate(), RenderPosition.BEFOREEND);

const boardElement = mainElement.querySelector('.films');
renderTemplate(boardElement, createMoviesListTemplate(), RenderPosition.BEFOREEND);

const moviesListElement = boardElement.querySelector('.films-list');
renderTemplate(moviesListElement, createMoviesListContainerTemplate(), RenderPosition.BEFOREEND);

const moviesListContainerElement = moviesListElement.querySelector('.films-list__container');
for (let i = 0; i < Math.min(movies.length, MOVIE_COUNT_PER_STEP); i++) {
  renderTemplate(moviesListContainerElement, createMovieCardTemplate(movies[i]), RenderPosition.BEFOREEND);
}
if (movies.length > MOVIE_COUNT_PER_STEP) {
  let renderedMovieCount = MOVIE_COUNT_PER_STEP;

  renderTemplate(moviesListElement, createShowMoreButtonTemplate(), RenderPosition.BEFOREEND);

  const showMoreButton = moviesListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    movies
      .slice(renderedMovieCount, renderedMovieCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => renderTemplate(moviesListContainerElement, createMovieCardTemplate(movie), RenderPosition.BEFOREEND));

    renderedMovieCount += MOVIE_COUNT_PER_STEP;

    if (renderedMovieCount >= movies.length) {
      showMoreButton.remove();
    }
  });
}

renderTemplate(footerElement, createMoviesCountTemplate(movies), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createPopupTemplate(movies[0]), RenderPosition.BEFOREEND);
