import { getReleaseDate, getMovieDuration } from '../utils/movie.js';
import SmarttView from './smart.js';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);

const createPopupTemplate = (data) => {
  const {
    comments,
    filmInfo: {
      title,
      alternativeTitle,
      totalRating,
      poster,
      ageRating,
      director,
      writers,
      actors,
      release: {
        date,
        releaseCountry
      },
      runtime,
      genre,
      description
    },
    userDetails: {
      watchlist,
      alreadyWatched,
      favorite
    },
    emotion,
  } = data;

  const MIN_INDEX_IN_GENRES = 1;

  const movieWriters = writers.join(', ');
  const movieActors = actors.join(', ');
  const releaseDate = getReleaseDate(date);
  const movieDuration = getMovieDuration(runtime);

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src=${poster} alt="">

            <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${movieWriters}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${movieActors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${releaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${movieDuration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genre${genre.length > MIN_INDEX_IN_GENRES ? 's' : ''}</td>
                <td class="film-details__cell">
                  ${genre.map((genreItem) => `<span class="film-details__genre">${genreItem}</span>`).join('')}
                </td>
              </tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlist ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched ${alreadyWatched ? 'film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${favorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${comments.length !== 0 ? comments.map((comment) => `<li class="film-details__comment">
                <span class="film-details__comment-emoji">
                  <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
                </span>
                <div>
                  <p class="film-details__comment-text">${comment.comment}</p>
                  <p class="film-details__comment-info">
                    <span class="film-details__comment-author">${comment.author}</span>
                    <span class="film-details__comment-day">${dayjs(comment.date).fromNow()}</span>
                    <button class="film-details__comment-delete" data-comment-id="${comment.id}">Delete</button>
                  </p>
                </div>
              </li>`
  ).join('') : ''}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
              ${emotion ? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">` : ''}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class PopupView extends SmarttView {
  _emotion = null;
  #commentsModel;
  #comments = null;

  constructor(movie, commentsModel) {
    super();
    this._data = PopupView.parseMovieToData(movie);
    this.#comments = this._data.comments;
    this.#commentsModel = commentsModel;

    this.#setInnerHandlers();
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setWatchlistPopupClickHandler(this._callback.watchlistClick);
    this.setAlreadyWatchedPopupClickHandler(this._callback.alreadyWatchedClick);
    this.setFavoritePopupClickHandler(this._callback.favoriteClick);
  }

  get template() {
    return createPopupTemplate(this._data);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonClickClickHandler);
    this.element.querySelectorAll('.film-details__emoji-item').forEach((item) =>
      item.addEventListener('click', this.#emojiClickHandler));
  }

  setCloseButtonClickHandler = (callback) => {
    this._callback.closeButtonClick = callback;
  }

  #closeButtonClickClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  setWatchlistPopupClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  }

  setAlreadyWatchedPopupClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#alreadyWatchedClickHandler);
  }

  setFavoritePopupClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  setCommentDeleteClickHandler(callback) {
    this._callback.commentDeleteClick = callback;
    this.element.querySelectorAll('.film-details__comment-delete').forEach((item) =>
      item.addEventListener('click', this.#commentDeleteClickHandler));
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  #emojiClickHandler = (evt) => {
    evt.preventDefault();
    const currentPosition = this.element.scrollTop;
    this.updateData({
      emotion: evt.target.value,
    });
    this.element.scrollTo(0, currentPosition);
    this.element.querySelector('.film-details__comment-input').placeholder = '';
  }

  #commentDeleteClickHandler = (evt) => {
    evt.preventDefault();
    const currentPosition = this.element.scrollTop;
    const indexComment = this.#comments.findIndex((comment) => comment.id === evt.target.dataset.commentId);
    this._callback.commentDeleteClick(this.#comments[indexComment]);
    this.updateData({
      comments: this.#commentsModel.comments,
    });
    this.element.scrollTo(0, currentPosition);
  }

  static parseMovieToData = (movie) => ({...movie,
    emotion: this._emotion,
  });

  static parseDataToMovie = (data) => {
    const movie = {...data};

    delete movie.emotion;

    return movie;
  };
}
