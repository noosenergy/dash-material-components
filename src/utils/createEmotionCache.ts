import createCache from '@emotion/cache';

export const createEmotionCache = () => {
  return createCache({
    key: 'dmc-', // Replace with your desired prefix
    prepend: true // To ensure the styles are loaded at the beginning of the head tag
  });
};
