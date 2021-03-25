export const cleanUpTickerSymbol = (tickerSymbol: string): string => {
    const alphaOnly = tickerSymbol.replace(/[^a-zA-Z\s]+/g, '');
    return alphaOnly.toUpperCase();
};
