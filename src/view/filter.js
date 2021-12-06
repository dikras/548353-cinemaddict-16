import AbstractView from './abstract.js';

const createFilterItemTemplate = (filter) => {
  const { type, name, count } = filter;
  return `<a href="#${type}" class="main-navigation__item ${name === 'All movies' ? 'main-navigation__item--active' : ''}">${name} ${name === 'All movies' ?
    '' : `<span class="main-navigation__item-count">${count}</span>`}</a>`;
};

const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems.map((filterItem) => createFilterItemTemplate(filterItem)).join('');
  return `<div class="main-navigation__items">
    ${filterItemsTemplate}
  </div>`;
};

export default class FilterView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
