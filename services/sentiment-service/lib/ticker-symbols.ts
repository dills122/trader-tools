import * as WordChecker from './word-checker';

const maxLength = 6;

export const isTickerSymbolLike = (input: string) => {
    if (input.length <= 0) {
        return false;
    }
    if (input.includes('$') && input.length <= maxLength + 1 && input.length >= 2) {
        return true;
    }
    if(!/[a-zA-Z]/.test(input)) {
        return false;
    }
    if (input.length <= maxLength && !WordChecker.checker(input)) {
        return true;
    }
    return false;
};

export const cleanUpTickerSymbol = (tickerSymbol: string) => {
    const alphaOnly = tickerSymbol.replace(/[^a-zA-Z\s]+/g, '');
    return alphaOnly.toUpperCase();
};