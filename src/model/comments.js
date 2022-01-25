import AbstractObservable from '../utils/abstract-observable.js';

export default class CommentsModel extends AbstractObservable {
  #apiService = null;
  #comments = [];
  #movie = null;

  constructor(apiService, movie) {
    super();
    this.#apiService = apiService;
    this.#movie = movie;

    /* this.#apiService.getComments(movie).then((comments) => {
      console.log(comments);
    }); */
  }

  set comments(comments) {
    this.#comments = [...comments];
  }

  get comments() {
    return this.#comments;
  }

  init = async () => {
    try {
      const comments = await this.#apiService.getComments(this.#movie);
      this.#comments = comments;
    } catch(err) {
      this.#comments = [];
    }
  }

  addComment = (updateType, update) => {
    this.#comments = [
      update,
      ...this.#comments,
    ];

    this._notify(updateType, update);
  }

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
