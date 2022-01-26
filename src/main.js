import { RenderPosition, render, remove } from './utils/render.js';
import MainNavigationView from './view/main-navigation.js';
import StatsLinkView from './view/stats-link.js';
import { FilterType, AUTHORIZATION, END_POINT } from './const.js';
import MovieListPresenter from './presenter/movie-list.js';
import FilterPresenter from './presenter/filter.js';
import MoviesModel from './model/movies.js';
import FilterModel from './model/filter.js';
import StatisticsView from './view/statistics.js';
import UserRankPresenter from './presenter/user-rank.js';
import ApiService from './api-service.js';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');

const moviesModel = new MoviesModel(new ApiService(END_POINT, AUTHORIZATION));

const filterModel = new FilterModel();

const mainNavigationComponent = new MainNavigationView();
const userRankPresenter = new UserRankPresenter(headerElement, moviesModel);
userRankPresenter.init();

render(mainElement, mainNavigationComponent, RenderPosition.BEFOREEND);

const mainNavigationElement = mainElement.querySelector('.main-navigation');
const filterPresenter = new FilterPresenter(mainNavigationElement, filterModel, moviesModel);
filterPresenter.init();
const filterElements = filterPresenter.filterComponent.element.querySelectorAll('.main-navigation__item');

const statsLinkComponent = new StatsLinkView();
render(mainNavigationElement, statsLinkComponent.element, RenderPosition.BEFOREEND);

const movieListPresenter = new MovieListPresenter(mainElement, moviesModel, filterModel);
movieListPresenter.init();

let statisticsComponent = null;

const handleNavigationClick = (navItem) => {
  switch (navItem) {
    case FilterType.ALL:
    case FilterType.WATCHLIST:
    case FilterType.HISTORY:
    case FilterType.FAVORITES:
      statsLinkComponent.element.classList.remove('main-navigation__item--active');
      if (statisticsComponent !== null ) {
        remove(statisticsComponent);
        movieListPresenter.init();
      }
      statisticsComponent = null;
      break;
    case FilterType.STATISTICS:
      filterElements.forEach((element) => {
        if (element.classList.contains('main-navigation__item--active')) {
          element.classList.remove('main-navigation__item--active');
        }
      });
      statsLinkComponent.element.classList.add('main-navigation__item--active');
      movieListPresenter.destroy();
      if (!statisticsComponent) {
        statisticsComponent = new StatisticsView(moviesModel.movies);
        render(mainElement, statisticsComponent, RenderPosition.BEFOREEND);
      }
      break;
  }
};

mainNavigationComponent.setNavigationClickHandler(handleNavigationClick);

moviesModel.init();
