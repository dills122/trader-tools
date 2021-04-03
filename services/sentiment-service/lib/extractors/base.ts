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
  strictMode?: boolean;
}

export class Extractor {
  protected whitelist: string[] = [];
  protected filterPattern: string[] = [];
  protected inputString: string;
  protected standardizedString: string[] = [];
  protected tickers: string[] = [];
  protected matchTolerance: number;
  protected strictMode: boolean;

  constructor(args: ExtractorArgs = {}) {
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
    if (args.strictMode !== undefined) {
      this.strictMode = args.strictMode;
    }
  }

  extract(inputString?: string | string[]): string[] {
    if (inputString) {
      this.setCorrectInputValue(inputString);
    }
    if (!this.inputString && this.standardizedString.length <= 0) {
      throw Error('No string to extract ticker symbols from');
    }
    if (this.standardizedString.length <= 0 && !_.isEmpty(this.inputString)) {
      this.standardizeInput();
    }
    console.log('Starting extraction', this.standardizedString);
    this.iterateWords();
    this.removeDuplicateTickers();
    console.log('Finished extraction', this.tickers);
    return this.tickers;
  }

  private iterateWords() {
    //TODO should update this to something better
    const whitelistMode = this.whitelist.length > 0;
    for (const word of this.standardizedString) {
      if (this.checkIfCommonWord(word)) {
        continue;
      }
      const isInWhiteList = this.checkAganistWhitelist(word);
      if (isInWhiteList) {
        this.getTickerCleanUpAndAddToList(word);
      }
      if (whitelistMode) {
        continue;
      }
      const containsFilterPattern = this.checkAganistFilterPatterns(word);
      if (containsFilterPattern) {
        this.getTickerCleanUpAndAddToList(word);
      }
      if (this.strictMode) {
        continue;
      }
      //Base case
      this.getTickerCleanUpAndAddToList(word);
    }
  }

  private getTickerCleanUpAndAddToList(word: string) {
    const cleanedUpPossibleTicker = cleanUpTickerSymbol(word);
    const ticker = this.getTickerIfExists(cleanedUpPossibleTicker);
    this.addTickerToListIfExists(ticker);
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
    this.standardizedString = Standardizer.standardize(this.inputString);
    return this.standardizedString;
  }

  private setCorrectInputValue(inputString) {
    if (Array.isArray(inputString)) {
      this.standardizedString = inputString;
    } else {
      this.inputString = inputString;
    }
  }

  private checkAganistWhitelist(word: string) {
    if (this.whitelist.length <= 0) {
      return false;
    }
    return this.whitelist.includes(word.toLowerCase()) || this.whitelist.includes(word.toUpperCase());
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
    const tickerResults = isTickerSymbol(inputString.toUpperCase(), {
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
