import AbstractObservable from '../utils/abstract-observable.js';

export default class CommentsModel extends AbstractObservable {
  #apiService = null;
  #comments = [];
  #movie = null;

  constructor(apiService, movie) {
    super();
    this.#apiService = apiService;
    this.#movie = movie;
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

  addComment = async (updateType, update, movie) => {
    try {
      const response = await this.#apiService.addComment(update, movie);
      const newComment = this.#adaptToClient(response);
      this.#comments = [newComment, ...this.#comments];
      this._notify(updateType, newComment);
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

  #adaptToClient = (comment) => {
    const adaptedComment = {...comment, comment};
    return adaptedComment;
  }
}
