import { AUTHORIZATION, END_POINT } from './const.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MoviesModel from './model/movies-model.js';
import FilterModel from './model/filter-model.js';
import UserRankPresenter from './presenter/user-rank-presenter.js';
import ApiService from './api-service.js';
import CommentsModel from './model/comments-model.js';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');

const moviesModel = new MoviesModel(new ApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new ApiService(END_POINT, AUTHORIZATION));

const filterModel = new FilterModel();

const userRankPresenter = new UserRankPresenter(headerElement, moviesModel);
userRankPresenter.init();

const movieListPresenter = new MovieListPresenter(mainElement, moviesModel, filterModel, commentsModel);
const filterPresenter = new FilterPresenter(mainElement, filterModel, moviesModel, movieListPresenter);

filterPresenter.init();
movieListPresenter.init();

moviesModel.init();
