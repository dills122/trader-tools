export const cleanUpTickerSymbol = (tickerSymbol: string) => {
    const alphaOnly = tickerSymbol.replace(/[^a-zA-Z\s]+/g, '');
    return alphaOnly.toUpperCase();
};
