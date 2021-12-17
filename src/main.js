import { RenderPosition, render } from './render.js';
import UserRankView from './view/user-rank.js';
import MainNavigationView from './view/main-navigation.js';
import FilterView from './view/filter.js';
import StatsLinkView from './view/stats-link.js';
import SortView from './view/sort.js';
import BoardView from './view/board.js';
import MoviesCountView from './view/movies-count.js';
import { generateMovie } from './mock/movie.js';
import { generateFilter } from './mock/filter.js';
import { MovieCount } from './const.js';
import MoviesListPresenter from './presenter/movies-list.js';

const movies = Array.from({length: MovieCount.MAIN_BLOCK}, generateMovie);
const filters = generateFilter(movies);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

render(headerElement, new UserRankView().element, RenderPosition.BEFOREEND);
render(mainElement, new MainNavigationView().element, RenderPosition.BEFOREEND);

const mainNavigationElement = mainElement.querySelector('.main-navigation');
render(mainNavigationElement, new FilterView(filters).element, RenderPosition.BEFOREEND);
render(mainNavigationElement, new StatsLinkView().element, RenderPosition.BEFOREEND);

if (movies.length !== 0) {
  render(mainElement, new SortView().element, RenderPosition.BEFOREEND);
}

render(mainElement, new BoardView().element, RenderPosition.BEFOREEND);

const boardElement = mainElement.querySelector('.films');

const movieListPresenter = new MoviesListPresenter(boardElement);
movieListPresenter.init(movies);

render(footerElement, new MoviesCountView(movies).element, RenderPosition.BEFOREEND);
