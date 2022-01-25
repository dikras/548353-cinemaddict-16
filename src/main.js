import { RenderPosition, render, remove } from './utils/render.js';
import MainNavigationView from './view/main-navigation.js';
import StatsLinkView from './view/stats-link.js';
import MoviesCountView from './view/movies-count.js';
// import { generateMovie } from './mock/movie.js';
import { FilterType } from './const.js';
import MovieListPresenter from './presenter/movie-list.js';
import FilterPresenter from './presenter/filter.js';
import MoviesModel from './model/movies.js';
import FilterModel from './model/filter.js';
import StatisticsView from './view/statistics.js';
import UserRankPresenter from './presenter/user-rank.js';
import ApiService from './api-service.js';

const AUTHORIZATION = 'Basic w78NalncokVub9gM';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict/';

// const movies = Array.from({length: MovieCount.MAIN_BLOCK}, generateMovie);
const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const moviesModel = new MoviesModel(new ApiService(END_POINT, AUTHORIZATION));

const filterModel = new FilterModel();

const mainNavigationComponent = new MainNavigationView();
const userRankPresenter = new UserRankPresenter(headerElement, moviesModel);
userRankPresenter.init();

render(mainElement, mainNavigationComponent, RenderPosition.BEFOREEND);

const mainNavigationElement = mainElement.querySelector('.main-navigation');
const filterPresenter = new FilterPresenter(mainNavigationElement, filterModel, moviesModel);
filterPresenter.init();
render(mainNavigationElement, new StatsLinkView().element, RenderPosition.BEFOREEND);

let movieListPresenter = new MovieListPresenter(mainElement, moviesModel, filterModel);
movieListPresenter.init();

let statisticsComponent = null;

const handleNavigationClick = (navItem) => {
  let count;
  switch (navItem) {
    case FilterType.ALL:
    case FilterType.WATCHLIST:
    case FilterType.HISTORY:
    case FilterType.FAVORITES:
      if (statisticsComponent !== null ) {
        count = 0;
        remove(statisticsComponent);
      }
      statisticsComponent = null;
      if (count === 0) {
        movieListPresenter = new MovieListPresenter(mainElement, moviesModel, filterModel);
        movieListPresenter.init();
      }
      count = count + 1;
      break;
    case FilterType.STATISTICS:
      movieListPresenter.destroy();
      statisticsComponent = new StatisticsView(moviesModel.movies);
      render(mainElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

mainNavigationComponent.setNavigationClickHandler(handleNavigationClick);

render(footerElement, new MoviesCountView(moviesModel.movies).element, RenderPosition.BEFOREEND);

moviesModel.init();
