import { WordTokenizer } from 'natural';
const aposToLexForm = require('apos-to-lex-form');
import SpellCorrector from 'spelling-corrector';
import StopWord from 'stopword';
import BadWords from 'bad-words';
import { isTickerSymbolLike, cleanUpTickerSymbol } from './ticker-symbols';

const SpellCorrectorInst = new SpellCorrector();
SpellCorrectorInst.loadDictionary();

export const standardizeInput = (input: string) => {
    const lexedInput: string = aposToLexForm(input);
    const loweredLexedInput = lexedInput.toLowerCase();
    const alphaOnlyLoweredLexedInput = loweredLexedInput.replace(/[^a-zA-Z\s]+/g, '');

    const tokenizer = new WordTokenizer();
    const tokenizedLexedInput = tokenizer.tokenize(alphaOnlyLoweredLexedInput);

    const badWordFilter = new BadWords();

    const nonProfaneCheckedInput = tokenizedLexedInput.filter((word) => {
        return !badWordFilter.isProfane(word);
    });

    const spellCheckedInput = nonProfaneCheckedInput.map((word) => {
        return SpellCorrectorInst.correct(word);
    });

    const filteredInput = StopWord.removeStopwords(spellCheckedInput);

    if (filteredInput.length <= 0) {
        throw Error('No results found after standardizing input');
    }

    return filteredInput;
};

export const extractStockOrCryptoTicker = (input: string, whitelist?: string[]) => {
    const lexedInput: string = aposToLexForm(input);

    const tokenizer = new WordTokenizer();
    const tokenizedLexedInput = tokenizer.tokenize(lexedInput);

    const filteredInput = StopWord.removeStopwords(tokenizedLexedInput);
    const tickerSymbols: string[] = [];

    for (let tokenInput of filteredInput) {
        const isTickerSymbol = isTickerSymbolLike(tokenInput);
        if (!isTickerSymbol) {
            continue;
        }
        const cleanedUpTickerSymbol = cleanUpTickerSymbol(tokenInput);
        if (whitelist && whitelist.length > 0 && !whitelist.includes(cleanedUpTickerSymbol)) {
            continue;
        }
        tickerSymbols.push(cleanedUpTickerSymbol);
    }
    return [...new Set(tickerSymbols)];
};