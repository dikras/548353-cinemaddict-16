import { nanoid } from 'nanoid';
import {generateValue} from '../utils/common.js';
import {authors, comments, commentDates, emotions} from '../const.js';

export const generateComment = () => ({
  id: nanoid(),
  author: generateValue(authors),
  comment: generateValue(comments),
  date: generateValue(commentDates),
  emotion: generateValue(emotions)
});
