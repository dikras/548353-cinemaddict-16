const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get movies() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getComments(movie) {
    return this.#load({url: `comments/${movie.id}`})
      .then(ApiService.parseResponse);
  }

  updateMovie = async (movie) => {
    const response = await this.#load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  addComment = async (comment, movie) => {
    const response = await this.#load({
      url: `comments/${movie.id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  deleteComment = async (comment) => await this.#load({
      url: `comments/${comment.id}`,
      method: Method.DELETE,
    });

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptToServer = (movie) => {
    const adaptedMovie = {...movie,
      'comments': movie.comments.every((comment) => typeof comment === 'string') ? movie.comments
        : movie.comments.map((comment) => comment.id),
      'film_info': {
        'title': movie.filmInfo.title,
        'alternative_title': movie.filmInfo.alternativeTitle,
        'poster': movie.filmInfo.poster,
        'runtime': movie.filmInfo.runtime,
        'genre': movie.filmInfo.genre,
        'total_rating': movie.filmInfo.totalRating,
        'age_rating': movie.filmInfo.ageRating,
        'director': movie.filmInfo.director,
        'writers': movie.filmInfo.writers,
        'actors': movie.filmInfo.actors,
        'release': {
          'date': movie.filmInfo.release.date,
          'release_country': movie.filmInfo.release.releaseCountry,
        },
        'description': movie.filmInfo.description,
      },
      'user_details': {
        'watchlist': movie.userDetails.watchlist,
        'already_watched': movie.userDetails.alreadyWatched,
        'watching_date': movie.userDetails.watchingDate,
        'favorite': movie.userDetails.favorite,
      },
    };

    delete adaptedMovie.filmInfo;
    delete adaptedMovie.userDetails;

    return adaptedMovie;
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
