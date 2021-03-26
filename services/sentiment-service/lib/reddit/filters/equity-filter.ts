import _ from 'lodash';
import { isCompanyName, lookupTickerByCompanyName } from 'is-ticker-symbol';
import { WordTokenizer } from 'natural';
import StopWord from 'stopword';
import { config } from '../config';
import { checker } from '../../word-checker';
const aposToLexForm = require('apos-to-lex-form');
import { RedditExtractor } from '../extractors';

export interface EquityFilterArgs {
  stringToAnalyze: string;
  matchTolerance?: number;
  blacklist?: string[];
}

export class EquityFilter {
  private stringToAnalyze: string;
  private matchTolerance = 0.2;
  private tokenizedInputString: string[];
  private matchedTickerSymbol: string;
  private blacklist: string[] = [];

  constructor(args: EquityFilterArgs) {
    this.stringToAnalyze = args.stringToAnalyze;
    if (args.matchTolerance) {
      this.matchTolerance = this.setMatchTolerance(args.matchTolerance);
    }
    this.blacklist = config.commonMissHitWords;
    if (args.blacklist) {
      this.blacklist = args.blacklist;
    }
    this.standardizeData();
  }

  filter(): string {
    if (this.tokenizedInputString.length <= 0) {
      return '';
    }
    const ticker = this.checkForTickerSymbol();
    if (ticker) {
      console.log('Found Ticker Match: ', ticker);
      this.matchedTickerSymbol = ticker;
      return this.getTickerSymbolIfPresent();
    }
    const companyName = this.checkForCompanyName();
    if (companyName) {
      console.log('Found Company Name Match: ', companyName);
      const ticker = lookupTickerByCompanyName(companyName);
      if (ticker) {
        this.matchedTickerSymbol = ticker;
        return this.getTickerSymbolIfPresent();
      }
    }
    return '';
  }

  public getTickerSymbolIfPresent(): string {
    return this.matchedTickerSymbol;
  }

  private filterAganistBlacklist(input: string[]) {
    return input.filter((word) => !this.blacklist.includes(word));
  }

  private filterAganistCommonWordChecker(input: string[]) {
    return input.filter((word) => !checker(word));
  }

  //TODO this should be a shared service, not dupped
  private standardizeData() {
    const lexedInput: string = aposToLexForm(this.stringToAnalyze);
    const alphaOnlyLoweredLexedInput = lexedInput.toLowerCase().replace(/[^a-zA-Z\s]+/g, '');
    const tokenizer = new WordTokenizer();
    const tokenizedLexedInput = tokenizer.tokenize(alphaOnlyLoweredLexedInput);
    const filteredStopWordInput = StopWord.removeStopwords(tokenizedLexedInput);
    const filteredBlacklistInput = this.filterAganistBlacklist(filteredStopWordInput);
    const filteredCommonWordInput = this.filterAganistCommonWordChecker(filteredBlacklistInput);
    this.tokenizedInputString = filteredCommonWordInput;
  }

  private checkForCompanyName() {
    let extractedCompanyName;
    this.tokenizedInputString.some((word, index) => {
      if (index % 2 === 0) {
        const str = this.tokenizedInputString.slice(index - 2, index + 1).join(' ');
        const company = isCompanyName(str, 0.1);
        if (company.isMatch) {
          extractedCompanyName = company.name;
          return true;
        }
      }
      if (index % 3 === 0) {
        const str = this.tokenizedInputString.slice(index - 3, index + 1).join(' ');
        const company = isCompanyName(str, 0.1);
        if (company.isMatch) {
          extractedCompanyName = company.name;
          return true;
        }
      }
      const company = isCompanyName(word, 0.1);
      if (company.isMatch) {
        extractedCompanyName = company.name;
        return true;
      }
      return false;
    });
    return extractedCompanyName;
  }

  private checkForTickerSymbol(): string {
    const tickers = new RedditExtractor({
      matchTolerance: this.matchTolerance
    }).extract(this.tokenizedInputString);
    return _.first(tickers) || '';
  }

  private setMatchTolerance(desiredTolerance: number) {
    if (!desiredTolerance || desiredTolerance > 1) {
      return -1;
    }
    return _.round(1 - desiredTolerance, 2);
  }
}
