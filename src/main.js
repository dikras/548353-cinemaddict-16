import { RenderPosition, render } from './utils/render.js';
import UserRankView from './view/user-rank.js';
import MainNavigationView from './view/main-navigation.js';
import StatsLinkView from './view/stats-link.js';
import MoviesCountView from './view/movies-count.js';
import { generateMovie } from './mock/movie.js';
import { MovieCount } from './const.js';
import MovieListPresenter from './presenter/movie-list.js';
import FilterPresenter from './presenter/filter.js';
import MoviesModel from './model/movies.js';
import FilterModel from './model/filter.js';

const movies = Array.from({length: MovieCount.MAIN_BLOCK}, generateMovie);

const moviesModel = new MoviesModel();
moviesModel.movies = movies;

const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

render(headerElement, new UserRankView().element, RenderPosition.BEFOREEND);
render(mainElement, new MainNavigationView().element, RenderPosition.BEFOREEND);

const mainNavigationElement = mainElement.querySelector('.main-navigation');
const filterPresenter = new FilterPresenter(mainNavigationElement, filterModel, moviesModel);
filterPresenter.init();
render(mainNavigationElement, new StatsLinkView().element, RenderPosition.BEFOREEND);

const movieListPresenter = new MovieListPresenter(mainElement, moviesModel, filterModel);
movieListPresenter.init();

render(footerElement, new MoviesCountView(movies).element, RenderPosition.BEFOREEND);
