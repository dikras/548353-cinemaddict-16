import { nanoid } from 'nanoid';
import {getRandomInteger, getRandomFloat, getRandomArray, generateValue} from '../utils/common.js';
import {
  titles,
  alternativeTitles,
  posters,
  directors,
  writers,
  actors,
  ageRatings,
  releaseDates,
  releaseCountries,
  runtimes,
  genres,
  descriptions,
  CommentsCount,
  watchingDates } from '../const.js';
import {generateComment} from '../mock/comments.js';

const commentsCount = getRandomInteger(CommentsCount.MIN, CommentsCount.MAX);

const movieComments = Array.from({length: commentsCount}, generateComment);

export const generateMovie = () => ({
  id: nanoid(),
  comments: movieComments,
  filmInfo: {
    title: generateValue(titles),
    alternativeTitle: generateValue(alternativeTitles),
    totalRating: getRandomFloat(),
    poster: generateValue(posters),
    ageRating: generateValue(ageRatings),
    director: generateValue(directors),
    writers: getRandomArray(writers),
    actors: getRandomArray(actors),
    release: {
      date: generateValue(releaseDates),
      releaseCountry: generateValue(releaseCountries)
    },
    runtime: generateValue(runtimes),
    genre: getRandomArray(genres),
    description: generateValue(descriptions)
  },
  userDetails: {
    watchlist: Boolean(getRandomInteger(0, 1)),
    alreadyWatched: Boolean(getRandomInteger(0, 1)),
    watchingDate: generateValue(watchingDates),
    favorite: Boolean(getRandomInteger(0, 1))
  }
});
