import AbstractObservable from '../utils/abstract-observable.js';

export default class CommentsModel extends AbstractObservable {
  #apiService = null;
  #comments = [];
  #movie = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  set comments(comments) {
    this.#comments = [...comments];
  }

  get comments() {
    return this.#comments;
  }

  init = async (movie) => {
    try {
      const comments = await this.#apiService.getComments(movie);
      this.#comments = comments;
    } catch(err) {
      this.#comments = [];
    }
  }

  addComment = async (updateType, update, movie) => {
    try {
      const response = await this.#apiService.addComment(update, movie);
      const newComments = this.#adaptToClient(response);
      this.#comments = newComments;
      this._notify(updateType, newComments);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  }

  deleteComment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#apiService.deleteComment(update);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  }

  #adaptToClient = (response) => {
    const adaptedComments = response.comments;

    return adaptedComments;
  }
}
