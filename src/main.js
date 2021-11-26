import { renderTemplate, RenderPosition } from './render.js';
import { createUserRankTemplate } from './view/user-rank-view.js';
import { createMainNavigationTemplate } from './view/main-navigation-view.js';
import { createSortTemplate } from './view/sort-view.js';
import { createBoardTemplate } from './view/board-view.js';
import { createMoviesListTemplate } from './view/movies-list-view.js';
import { createMoviesListContainerTemplate } from './view/movies-list-container-view.js';
import { createMovieCardTemplate } from './view/movie-card-view.js';
import { createShowMoreButtonTemplate } from './view/show-more-button.js';
import { createMoviesCountTemplate } from './view/movies-count.js';

const MOVIE_COUNT = 5;

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

renderTemplate(headerElement, createUserRankTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createMainNavigationTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createBoardTemplate(), RenderPosition.BEFOREEND);

const boardElement = mainElement.querySelector('.films');
renderTemplate(boardElement, createMoviesListTemplate(), RenderPosition.BEFOREEND);

const moviesListElement = boardElement.querySelector('.films-list');
renderTemplate(moviesListElement, createMoviesListContainerTemplate(), RenderPosition.BEFOREEND);

const moviesListContainerElement = moviesListElement.querySelector('.films-list__container');
for (let i = 0; i < MOVIE_COUNT; i++) {
  renderTemplate(moviesListContainerElement, createMovieCardTemplate(), RenderPosition.BEFOREEND);
}

renderTemplate(moviesListElement, createShowMoreButtonTemplate(), RenderPosition.BEFOREEND);
renderTemplate(footerElement, createMoviesCountTemplate(), RenderPosition.BEFOREEND);
