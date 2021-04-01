import { WordTokenizer } from 'natural';
const aposToLexForm = require('apos-to-lex-form');
import SpellCorrector from 'spelling-corrector';
import StopWord from 'stopword';
import BadWords from 'bad-words';

export interface StandardizeInputOptions {
  disableStopWords?: boolean;
  disableProfanityFilter?: boolean;
  disableSpellCheckFilter?: boolean;
}

export interface InputStandardizerArgs {
  options?: StandardizeInputOptions;
}

export class InputStandardizer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private SpellCorrectorInst: any;
  private options: StandardizeInputOptions;
  constructor(args: InputStandardizerArgs = {}) {
    const SpellCorrectorInst = new SpellCorrector();
    SpellCorrectorInst.loadDictionary();
    this.SpellCorrectorInst = SpellCorrectorInst;
    if (args.options) {
      this.options = args.options;
    }
  }

  standardize(input: string, options: StandardizeInputOptions = this.options): string[] {
    const { disableProfanityFilter, disableStopWords, disableSpellCheckFilter } = options || {};
    const lexedInput: string = aposToLexForm(input);
    const loweredLexedInput = lexedInput.toLowerCase();
    const alphaOnlyLoweredLexedInput = loweredLexedInput.replace(/[^a-zA-Z\s]+/g, '');

    const tokenizer = new WordTokenizer();
    let tokenizedLexedInput: string[] = tokenizer.tokenize(alphaOnlyLoweredLexedInput);

    if (!disableProfanityFilter) {
      const badWordFilter = new BadWords();
      tokenizedLexedInput = tokenizedLexedInput.filter((word) => {
        return !badWordFilter.isProfane(word.toUpperCase());
      });
    }

    if (!disableSpellCheckFilter) {
      tokenizedLexedInput = tokenizedLexedInput.map((word) => {
        return this.SpellCorrectorInst.correct(word);
      });
    }

    if (!disableStopWords) {
      tokenizedLexedInput = StopWord.removeStopwords(tokenizedLexedInput);
    }

    if (tokenizedLexedInput.length <= 0) {
      throw Error('No results found after standardizing input');
    }

    return tokenizedLexedInput;
  }

  scrubTickerFromInput(
    inputString: string | string[],
    ticker: string,
    filterPatterns: string[] = []
  ): string[] {
    ticker = ticker.toLowerCase();
    if (typeof inputString === 'string') {
      inputString = this.standardize(inputString, {
        disableProfanityFilter: true,
        disableSpellCheckFilter: true,
        disableStopWords: true
      });
    }
    return inputString.filter((token) => {
      if (ticker === token) {
        return false;
      }
      const matchWithFilterPattern = filterPatterns.some((pattern) => token === `${pattern}${ticker}`);
      if (matchWithFilterPattern) {
        return false;
      }
      return true;
    });
  }
}
