export const cleanUpTickerSymbol = (tickerSymbol: string): string => {
  const alphaOnly = tickerSymbol.replace(/[^a-zA-Z\s]+/g, '');
  return alphaOnly.toUpperCase();
};

export const containsFilter = (inputString: string, filterPattern: string): boolean => {
  return inputString.startsWith(filterPattern, 0);
};
