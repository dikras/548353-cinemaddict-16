import AbstractView from './abstract.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const { type, name, count } = filter;
  return `<a href="#${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-filter-type="${type}">${name} ${name === 'All movies' ?
    '' : `<span class="main-navigation__item-count" data-filter-type="${type}">${count}</span>`}</a>`;
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems.map((filterItem) => createFilterItemTemplate(filterItem, currentFilterType)).join('');
  return `<div class="main-navigation__items">
    ${filterItemsTemplate}
  </div>`;
};

export default class FilterView extends AbstractView {
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
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A' && evt.target.tagName !== 'SPAN') {
      return;
    }
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }
}
