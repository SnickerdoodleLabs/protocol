export const isValidURL = (url: string) => {
  const regexpUrl = /(https?|ipfs)/i;
  return !!regexpUrl.test(url);
};
