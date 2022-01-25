import AbstractObservable from '../utils/abstract-observable.js';
import { UpdateType } from '../const.js';

export default class MoviesModel extends AbstractObservable {
  #apiService = null;
  #movies = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get movies() {
    return this.#movies;
  }

  init = async () => {
    // const movies = await this.#apiService.movies;
    // this.#movies = movies.map(this.#adaptToClient);
    try {
      const movies = await this.#apiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
    } catch(err) {
      this.#movies = [];
    }

    this._notify(UpdateType.INIT);
  }

  updateMovie = (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  #adaptToClient = (movie) => {
    const adaptedMovie = {...movie,
      filmInfo:  {
        title: movie['film_info']['title'],
        alternativeTitle: movie['film_info']['alternative_title'],
        poster: movie['film_info']['poster'],
        runtime: movie['film_info']['runtime'],
        genre: movie['film_info']['genre'],
        totalRating: movie['film_info']['total_rating'],
        ageRating: movie['film_info']['age_rating'],
        director: movie['film_info']['director'],
        writers: movie['film_info']['writers'],
        actors: movie['film_info']['actors'],
        release: {
          date: movie['film_info']['release']['date'] !== null ? movie['film_info']['release']['date'] : new Date().toISOString(),
          releaseCountry: movie['film_info']['release']['release_country'],
        },
        description: movie['film_info']['description'],
      },
      userDetails: {
        watchlist: movie['user_details']['watchlist'],
        alreadyWatched: movie['user_details']['already_watched'],
        watchingDate: movie['user_details']['watching_date'] !== null ? movie['user_details']['watching_date'] : new Date().toISOString(),
        favorite: movie['user_details']['favorite'],
      },
    };

    delete adaptedMovie['film_info'];
    delete adaptedMovie['user_details'];

    return adaptedMovie;
  }
}
