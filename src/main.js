import { AUTHORIZATION, END_POINT } from './const.js';
import MovieListPresenter from './presenter/movie-list.js';
import FilterPresenter from './presenter/filter.js';
import MoviesModel from './model/movies.js';
import FilterModel from './model/filter.js';
import UserRankPresenter from './presenter/user-rank.js';
import ApiService from './api-service.js';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');

const moviesModel = new MoviesModel(new ApiService(END_POINT, AUTHORIZATION));

const filterModel = new FilterModel();

const userRankPresenter = new UserRankPresenter(headerElement, moviesModel);
userRankPresenter.init();

const movieListPresenter = new MovieListPresenter(mainElement, moviesModel, filterModel);
const filterPresenter = new FilterPresenter(mainElement, filterModel, moviesModel, movieListPresenter);

filterPresenter.init();
movieListPresenter.init();

moviesModel.init();
