import {getRandomInteger, getRandomFloat, getRandomArray, generateValue} from '../utils.js';
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
  CommentsCount } from '../const.js';
import {generateComment} from '../mock/comments.js';

const commentsCount = getRandomInteger(CommentsCount.MIN, CommentsCount.MAX);

const movieComments = Array.from({length: commentsCount}, generateComment);

export const generateMovie = () => ({
  id: '1',
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
    watchingDate: '2021-11-30T16:12:32.554Z',
    favorite: Boolean(getRandomInteger(0, 1))
  }
});