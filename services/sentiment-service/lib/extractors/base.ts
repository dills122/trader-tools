import { isTickerSymbol } from 'is-ticker-symbol';
import * as WordChecker from '../word-checker';
import { cleanUpTickerSymbol, containsFilter } from '../ticker-symbols';
import _ from 'lodash';
import { InputStandardizer } from '../standardize-input';

export interface ExtractorArgs {
  whitelist?: string[];
  filterPattern?: string[];
  inputString?: string | string[];
  matchTolerance?: number;
}

export class Extractor {
  protected whitelist: string[] = [];
  protected filterPattern: string[] = [];
  protected inputString: string;
  protected formattedString: string[] = [];
  protected tickers: string[] = [];
  protected matchTolerance: number;

  constructor(args: ExtractorArgs) {
    if (args.whitelist) {
      this.whitelist = args.whitelist;
    }
    if (args.filterPattern) {
      this.filterPattern = args.filterPattern;
    }
    if (args.inputString) {
      this.setCorrectInputValue(args.inputString);
    }
    if (args.matchTolerance) {
      this.matchTolerance = args.matchTolerance;
    }
  }

  extract(inputString?: string | string[]): string[] {
    if (inputString) {
      this.setCorrectInputValue(inputString);
    }
    if (!this.inputString && this.formattedString.length <= 0) {
      throw Error('No string to extract ticker symbols from');
    }
    if (this.formattedString.length <= 0 && !_.isEmpty(this.inputString)) {
      this.standardizeInput();
    }
    console.log('Starting extraction', this.formattedString);
    this.iterateWords();
    this.removeDuplicateTickers();
    console.log('Finished extraction', this.tickers);
    return this.tickers;
  }

  private iterateWords() {
    for (const word of this.formattedString) {
      if (this.checkIfCommonWord(word)) {
        continue;
      }
      const isInWhiteList = this.checkAganistWhitelist(word);
      if (isInWhiteList) {
        const ticker = this.getTickerIfExists(word);
        this.addTickerToListIfExists(ticker);
      }
      const containsFilterPattern = this.checkAganistFilterPatterns(word);
      if (containsFilterPattern) {
        const cleanedUpPossibleTicker = cleanUpTickerSymbol(word);
        const ticker = this.getTickerIfExists(cleanedUpPossibleTicker);
        this.addTickerToListIfExists(ticker);
      }
      //Base case
      const cleanedUpPossibleTicker = cleanUpTickerSymbol(word);
      const ticker = this.getTickerIfExists(cleanedUpPossibleTicker);
      this.addTickerToListIfExists(ticker);
    }
  }

  private checkIfCommonWord(word: string): boolean {
    return WordChecker.checker(word);
  }

  private standardizeInput(): string[] {
    const Standardizer = new InputStandardizer({
      options: {
        disableProfanityFilter: true,
        disableSpellCheckFilter: true
      }
    });
    this.formattedString = Standardizer.standardize(this.inputString);
    return this.formattedString;
  }

  private setCorrectInputValue(inputString) {
    if (Array.isArray(inputString)) {
      this.formattedString = inputString;
    } else {
      this.inputString = inputString;
    }
  }

  private checkAganistWhitelist(word: string) {
    if (this.whitelist.length <= 0) {
      return false;
    }
    return this.whitelist.includes(word);
  }

  private checkAganistFilterPatterns(word: string) {
    if (this.filterPattern.length <= 0) {
      return false;
    }
    return this.filterPattern.some((pattern) => {
      return containsFilter(word, pattern);
    });
  }

  private getTickerIfExists(inputString: string): string {
    const tickerResults = isTickerSymbol(inputString, {
      output: true,
      matchTolerance: this.matchTolerance || 0.2
    });
    if (typeof tickerResults === 'boolean') {
      return '';
    }
    return tickerResults;
  }

  private addTickerToListIfExists(inputString: string | undefined) {
    if (!inputString || _.isEmpty(inputString)) {
      return;
    }
    this.tickers.push(inputString);
  }

  private removeDuplicateTickers() {
    this.tickers = [...new Set(this.tickers)];
  }
}
