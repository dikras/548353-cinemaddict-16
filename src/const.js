export const authors = ['Ilya O\'Reilly', 'John Lennon', 'Ringo Starr', 'Paul McCartney', 'George Harrison', 'Peter Gabriel', 'Phil Collins', 'Tim Macoveev', 'John Doe'];

export const userCommentDates = ['2022-01-17T16:12:32.554Z', '2022-01-16T16:12:32.554Z', '2022-01-07T16:12:32.554Z', '2021-12-31T16:12:32.554Z'];

export const MovieCount = {
  PER_STEP: 5,
};

export const CommentsCount = {
  MIN: 0,
  MAX: 5
};

export const KeyEvent = {
  ESC_IE: 'Esc',
  ESC_ALL_BROWSERS: 'Escape',
  ENTER: 'Enter'
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  DETAILS: 'DETAILS',
};

export const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'by-date',
  BY_RATING: 'by-rating',
};

export const UserAction = {
  UPDATE_MOVIE: 'UPDATE_MOVIE',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
  STATISTICS: 'statistics'
};

export const UserRank = {
  novice: {
    rank: 'Novice',
    from: 1,
    to: 10,
  },
  fan: {
    rank: 'Fan',
    from: 11,
    to: 20,
  },
  movieBuff: {
    rank: 'Movie buff',
    from: 21,
    to: Infinity,
  },
};

export const DurationType = {
  HOURS: 'hours',
  MINUTES: 'minutes',
};

export const PeriodType = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const AUTHORIZATION = 'Basic w78NalncokVub9gM';
export const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict/';

export const PopupViewState = {
  DEFAULT: 'DEFAULT',
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING_DELETE: 'ABORTING_DELETE',
  ABORTING_SAVE: 'ABORTING_SAVE',
};
