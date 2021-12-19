import {generateValue} from '../utils/common.js';
import {authors, comments, commentDates, emotions} from '../const.js';

export const generateComment = () => ({
  id: '10',
  author: generateValue(authors),
  comment: generateValue(comments),
  date: generateValue(commentDates),
  emotion: generateValue(emotions)
});
