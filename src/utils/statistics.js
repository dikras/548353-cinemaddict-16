import { PeriodType, DurationType, UserRank } from '../const.js';
import { filter } from './filter.js';
import { FilterType } from '../const.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import isToday from 'dayjs/plugin/isToday';
dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(isToday);

export const getUserRank = (movies) => {
  const moviesWatchedCount = filter[FilterType.HISTORY](movies).length;
  if ((moviesWatchedCount >= UserRank.novice.from) && (moviesWatchedCount <= UserRank.novice.to)) {
    return UserRank.novice.rank;
  }
  if ((moviesWatchedCount >= UserRank.fan.from) && (moviesWatchedCount <= UserRank.fan.to)) {
    return UserRank.fan.rank;
  }
  if ((moviesWatchedCount >= UserRank.movieBuff.from) && (moviesWatchedCount < UserRank.movieBuff.to)) {
    return UserRank.movieBuff.rank;
  }
  return '';
};

export const getWatchedMoviesInRange = (movies, dateFrom, dateTo, currentDate) =>
  movies.reduce((moviesInRange, movie) => {
    if (currentDate === PeriodType.ALL) {
      moviesInRange.push(movie);
      return moviesInRange;
    }
    if (currentDate === PeriodType.TODAY && dayjs(movie.userDetails.watchingDate).isToday()) {
      moviesInRange.push(movie);
      return moviesInRange;
    }
    if (dayjs(movie.userDetails.watchingDate).isBetween(dateFrom, dateTo, null, [])) {
      moviesInRange.push(movie);
    }
    return moviesInRange;
  }, []);


export const getDuration = (movies, type) => {
  const totalDuration = movies.reduce((totalTime, movie) => totalTime + movie.filmInfo.runtime, 0);
  if (type === DurationType.HOURS) {
    const hours = dayjs.duration(totalDuration, 'm').asHours();
    return Math.floor(hours);
  }
  return dayjs.duration(totalDuration, 'm').minutes();
};

export const getGenres = (movies) => movies.reduce((genre, movie) => [...genre, ...movie.filmInfo.genre], []);

export const getCountGenres = (genres) => genres.reduce( (total, genre) => {
  total[genre] = (total[genre] || 0) + 1 ;
  return total;
} , {});

export const getTopGenre = (genres) => Object.keys(genres).reduce((max, current) => (genres[max] > genres[current]) ? max : current);

export const getSortGenreKeys = (genres) => Object.keys(genres).sort((a,b) => genres[b]-genres[a]);

export const getSortGenreValues = (genres) => Object.values(genres).sort((a,b) => b-a);

export const getDateFrom = (type) => {
  const countAgo = 1;
  return dayjs().subtract(countAgo, type).toDate();
};
