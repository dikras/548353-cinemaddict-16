export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFloat = (a = 1.1, b = 9.0) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);

  return Math.round((lower + Math.random() * (upper - lower + 1)) * 10) / 10;
};

export const getRandomArray = (array) => {
  const shuffledArray = array.sort(() => 0.5 - Math.random());
  return shuffledArray.slice(0, 3);
};

export const generateValue = (values) => {
  const randomIndex = getRandomInteger(0, values.length - 1);
  return values[randomIndex];
};
