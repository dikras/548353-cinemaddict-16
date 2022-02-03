import Abstract from './abstract.js';
import { FilterType } from '../const.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const { type, name, count } = filter;
  return `<a href="#${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-filter-type="${type}">${name} ${name === 'All movies' ?
    '' : `<span class="main-navigation__item-count" data-filter-type="${type}">${count}</span>`}</a>`;
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems.map((filterItem) => createFilterItemTemplate(filterItem, currentFilterType)).join('');
  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              ${filterItemsTemplate}
            </div>
            <a href="#stats" class="main-navigation__additional ${currentFilterType === FilterType.STATISTICS ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType.STATISTICS}">Stats</a>
          </nav>`;
};

export default class FilterView extends Abstract {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    const filterElements = this.element.querySelector('.main-navigation__items');
    filterElements.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A' && evt.target.tagName !== 'SPAN') {
      return;
    }
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }

  setNavigationClickHandler = (callback) => {
    this._callback.navigationClick = callback;
    this.element.addEventListener('click', this.#navigationClickHandler);
  }

  #navigationClickHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.navigationClick(evt.target.dataset.filterType);
  }
}
