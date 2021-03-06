import { getReleaseDate, getMovieDuration } from '../utils/movie.js';
import Smart from './smart.js';
import { KeyEvent } from '../const.js';

import he from 'he';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);

const SHAKE_ANIMATION_TIMEOUT = 600;
const MILLISECONDS_PER_SECOND = 1000;

const createPopupTemplate = (data, commentId) => {
  const {
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
  } = data.film;

  const { comments, isDisabled, isDeleting } = data;

  const { emotion, userComment } = data.newComment;

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
                  <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
                  <p class="film-details__comment-info">
                    <span class="film-details__comment-author">${comment.author}</span>
                    <span class="film-details__comment-day">${dayjs(comment.date).fromNow()}</span>
                    <button class="film-details__comment-delete" ${isDisabled ? 'disabled' : ''} data-comment-id="${comment.id}">${(comment.id === commentId && isDeleting) ? 'Deleting...' : 'Delete'}</button>
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
              <textarea
                class="film-details__comment-input"
                placeholder="Select reaction below and write comment here"
                name="comment"
                ${isDisabled ? 'disabled' : ''}>${userComment ? userComment : ''}</textarea>
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

export default class PopupView extends Smart {
  #commentId;

  constructor(movie, comments) {
    super();
    this._data = {
      film: movie,
      comments,
      newComment: {
        emotion: '',
        userComment: ''
      },
      isDisabled: false,
      isDeleting: false
    };

    this.#setInnerHandlers();
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setWatchlistPopupClickHandler(this._callback.watchlistClick);
    this.setAlreadyWatchedPopupClickHandler(this._callback.alreadyWatchedClick);
    this.setFavoritePopupClickHandler(this._callback.favoriteClick);
    this.setCommentDeleteClickHandler(this._callback.commentDeleteClick);
    this.setKeydownCtrlEnterHandler(this._callback.commentAdd);
  }

  get template() {
    return createPopupTemplate(this._data, this.#commentId);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonClickClickHandler);
    this.element.querySelectorAll('.film-details__emoji-item').forEach((item) =>
      item.addEventListener('click', this.#emojiClickHandler));
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
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
    const deleteButtons = this.element.querySelectorAll('.film-details__comment-delete');
    deleteButtons.forEach((btn) => btn.addEventListener('click', this.#commentDeleteClickHandler));
  }

  setKeydownCtrlEnterHandler(callback) {
    this._callback.commentAdd = callback;
    document.addEventListener('keydown', this.#keydownCtrlEnterHandler);
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
    const commentInput = this.element.querySelector('.film-details__comment-input');
    this.updateData({
      newComment: {
        emotion: evt.target.value,
        userComment: commentInput.value
      }
    });
    this.element.scrollTo(0, currentPosition);
  }

  #commentDeleteClickHandler = (evt) => {
    evt.preventDefault();
    const indexComment = this._data.comments.findIndex((comment) => comment.id === evt.target.dataset.commentId);
    this.#commentId = evt.target.dataset.commentId;
    this._callback.commentDeleteClick(this._data.comments[indexComment]);
  }

  #keydownCtrlEnterHandler = (evt) => {
    this._comment = this.element.querySelector('.film-details__comment-input').value;
    if (evt.ctrlKey && evt.key === KeyEvent.ENTER) {
      const userComment = {
        comment: this._comment,
        emotion: this._data.newComment.emotion,
      };
      if (!userComment.comment || !userComment.emotion) {
        this.shakeCommentInput();
        return;
      }
      this._callback.commentAdd(userComment);
    }
  }

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      newComment: {
        comment: evt.target.value,
        emotion: this._data.newComment.emotion
      }
    }, true);
  }

  shakeCommentInput = (callback) => {
    const commentInputElement = this.element.querySelector('.film-details__comment-input');
    commentInputElement.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MILLISECONDS_PER_SECOND}s`;
    setTimeout(() => {
      commentInputElement.style.animation = '';
      if (callback) {
        callback();
      }
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  shakeCommentBlock = (callback) => {
    const commentElements = this.element.querySelectorAll('.film-details__comment');
    commentElements.forEach((element) => {
      element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MILLISECONDS_PER_SECOND}s`;
      setTimeout(() => {
        element.style.animation = '';
        callback();
      }, SHAKE_ANIMATION_TIMEOUT);
    });
  }
}
