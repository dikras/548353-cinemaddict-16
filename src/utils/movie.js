import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const getReleaseYear = (date) => {
  const releaseYear = dayjs(date).format('YYYY');
  return releaseYear;
};

export const getReleaseDate = (date) => {
  const releaseDate = dayjs(date).format('D MMMM YYYY');
  return releaseDate;
};

export const getMovieDuration = (runtime) => {
  const movieDuration = `${dayjs.duration(runtime, 'minutes').format('H')}h ${dayjs.duration(runtime, 'minutes').format('mm')}m`;
  return movieDuration;
};

export const sortByRating = (movieA, movieB) => movieB.filmInfo.totalRating - movieA.filmInfo.totalRating;

export const sortByDate = (movieA, movieB) => dayjs(movieB.filmInfo.release.date).diff(dayjs(movieA.filmInfo.release.date));

// export const getWatchedMoviesCount = (movies) => movies.reduce((total, movie) => total + movie.userDetails.alreadyWatched, 0);
