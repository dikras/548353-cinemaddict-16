import FilterView from '../view/filter.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';
import StatisticsView from '../view/statistics.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #moviesModel = null;
  #movieListPresenter = null;

  #filterComponent = null;
  #statisticsComponent = null;

  #navLinkType = null;

  constructor(filterContainer, filterModel, moviesModel, movieListPresenter) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#moviesModel = moviesModel;
    this.#movieListPresenter = movieListPresenter;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const movies = this.#moviesModel.movies;

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](movies).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](movies).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](movies).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](movies).length,
      },
    ];
  }

  get filterComponent() {
    return this.#filterComponent;
  }

  init = () => {
    const filters = this.filters;

    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
    this.#filterComponent.setNavigationClickHandler(this.#handleNavigationClick);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  #handleNavigationClick = (navItem) => {
    switch (navItem) {
      case FilterType.ALL:
      case FilterType.WATCHLIST:
      case FilterType.HISTORY:
      case FilterType.FAVORITES:
        if (this.#statisticsComponent !== null ) {
          remove(this.#statisticsComponent);
          this.#movieListPresenter.init();
        }
        this.#statisticsComponent = null;
        break;
      case FilterType.STATISTICS:
        if (!this.#statisticsComponent) {
          this.#movieListPresenter.destroy();
          this.#statisticsComponent = new StatisticsView(this.#moviesModel.movies);
          render(this.#filterContainer, this.#statisticsComponent, RenderPosition.BEFOREEND);
          this.#filterModel.setFilter(UpdateType.PATCH, FilterType.STATISTICS);
        }
        break;
    }
  };
}
