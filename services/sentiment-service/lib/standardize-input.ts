import { WordTokenizer } from 'natural';
const aposToLexForm = require('apos-to-lex-form');
import SpellCorrector from 'spelling-corrector';
import StopWord from 'stopword';
import BadWords from 'bad-words';
import { isTickerSymbol } from 'is-ticker-symbol';
import { checker } from './word-checker';

export interface StandardizeInputOptions {
  disableStopWords?: boolean;
  disableProfanityFilter?: boolean;
  disableTickerSymbolFilter?: boolean;
}

export interface InputStandardizerArgs {
  whitelist?: string[];
  options?: StandardizeInputOptions;
}

export class InputStandardizer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private SpellCorrectorInst: any;
  private options: StandardizeInputOptions;
  private whitelist: string[];
  constructor(args: InputStandardizerArgs = {}) {
    const SpellCorrectorInst = new SpellCorrector();
    SpellCorrectorInst.loadDictionary();
    this.SpellCorrectorInst = SpellCorrectorInst;
    if (args.options) {
      this.options = args.options;
    }
    if (args.whitelist) {
      this.whitelist = args.whitelist;
    }
  }

  standardize(
    input: string,
    whitelist: string[] = this.whitelist || [],
    options: StandardizeInputOptions = this.options
  ): string[] {
    const { disableProfanityFilter, disableStopWords, disableTickerSymbolFilter } = options || {};
    const lexedInput: string = aposToLexForm(input);
    const loweredLexedInput = lexedInput.toLowerCase();
    const alphaOnlyLoweredLexedInput = loweredLexedInput.replace(/[^a-zA-Z\s]+/g, '');

    const tokenizer = new WordTokenizer();
    let tokenizedLexedInput: string[] = tokenizer.tokenize(alphaOnlyLoweredLexedInput);

    const badWordFilter = new BadWords();

    if (!disableProfanityFilter) {
      tokenizedLexedInput = tokenizedLexedInput.filter((word) => {
        return !badWordFilter.isProfane(word.toUpperCase());
      });
    }

    if (!disableTickerSymbolFilter) {
      tokenizedLexedInput = tokenizedLexedInput.filter((word) => {
        if (whitelist.includes(word)) {
          return true;
        }
        if (checker(word)) {
          return true;
        }
        return !isTickerSymbol(word.toUpperCase());
      });
    }

    tokenizedLexedInput = tokenizedLexedInput.map((word) => {
      return this.SpellCorrectorInst.correct(word);
    });

    if (!disableStopWords) {
      tokenizedLexedInput = StopWord.removeStopwords(tokenizedLexedInput);
    }

    if (tokenizedLexedInput.length <= 0) {
      throw Error('No results found after standardizing input');
    }

    return tokenizedLexedInput;
  }
}
