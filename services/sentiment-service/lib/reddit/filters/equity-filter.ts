import _ from 'lodash';
import { isCompanyName, lookupTickerByCompanyName } from 'is-ticker-symbol';
import { config } from '../config';
import { checker } from '../../word-checker';
import { RedditExtractor } from '../extractors';
import { InputStandardizer } from '../../standardize-input';
import { Loggers } from 'shared-sdk';

const AuditLogger = Loggers.Audit.logger;

export interface EquityFilterArgs {
  stringToAnalyze: string;
  matchTolerance?: number;
  blacklist?: string[];
  equityWhitelist?: string[];
  auditMode?: boolean;
}

export class EquityFilter {
  private stringToAnalyze: string;
  private matchTolerance = 0.2;
  private tokenizedInputString: string[];
  private matchedTickerSymbol: string;
  private blacklist: string[] = [];
  private whitelist: string[] = [];

  private disableCompanyMatching = true; // setting this so I can disable until rework
  //Testing Param
  private auditMode: boolean;

  constructor(args: EquityFilterArgs) {
    this.stringToAnalyze = args.stringToAnalyze;
    if (args.matchTolerance) {
      this.matchTolerance = this.setMatchTolerance(args.matchTolerance);
    }
    if (args.equityWhitelist) {
      this.whitelist = args.equityWhitelist;
    }
    this.blacklist = args.blacklist || config.commonMissHitWords;
    this.auditMode = args.auditMode || false;
    this.standardizeData();
  }

  filter(): string | null {
    if (this.tokenizedInputString.length <= 0) {
      return null;
    }
    try {
      const ticker = this.checkForTickerSymbol();
      if (ticker) {
        console.log('Found Ticker Match: ', ticker);
        this.matchedTickerSymbol = ticker;
        return this.getTickerSymbolIfPresent();
      }
    } catch (err) {
      console.error(err);
      return null;
    }
    if (!this.disableCompanyMatching) {
      //TODO need to rework this
      const companyName = this.checkForCompanyName();
      if (companyName) {
        console.log('Found Company Name Match: ', companyName);
        const ticker = lookupTickerByCompanyName(companyName);
        if (ticker) {
          this.matchedTickerSymbol = ticker;
          return this.getTickerSymbolIfPresent();
        }
      }
    }
    return null;
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

  private standardizeData() {
    const Standardizer = new InputStandardizer({
      options: {
        disableProfanityFilter: true, //TODO do more testing to see how this impacts results
        disableSpellCheckFilter: true
      }
    });
    try {
      const standardizedString = Standardizer.standardize(this.stringToAnalyze);
      AuditLogger.log(`Standardized: ${standardizedString}`, this.auditMode);
      const filteredBlacklistInput = this.filterAganistBlacklist(standardizedString);
      AuditLogger.log(`Blacklist Flitered: ${filteredBlacklistInput}`, this.auditMode);
      const filteredCommonWordInput = this.filterAganistCommonWordChecker(filteredBlacklistInput);
      AuditLogger.log(`Common Word Flitered: ${filteredCommonWordInput}`, this.auditMode);
      this.tokenizedInputString = filteredCommonWordInput;
    } catch (err) {
      this.tokenizedInputString = [];
    }
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
      matchTolerance: this.matchTolerance,
      whitelist: this.whitelist
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
