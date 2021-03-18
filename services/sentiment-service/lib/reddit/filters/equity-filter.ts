import _ from "lodash";
import { isCompanyName, isTickerSymbol, lookupTickerByCompanyName } from 'is-ticker-symbol';
import { standardizeInput } from '../../standardize-input';

export interface EquityFilterArgs {
    stringToAnalyze: string,
    matchTolerance?: number
};

export class EquityFilter {
    private stringToAnalyze: string;
    private matchTolerance: number = .2;
    private tokenizedInputString: string[];
    private matchedTickerSymbol: string;

    constructor(args: EquityFilterArgs) {
        this.stringToAnalyze = args.stringToAnalyze;
        if (args.matchTolerance) {
            this.matchTolerance = this.setMatchTolerance(args.matchTolerance);
        }
        this.tokenizeString();
    }

    filter() {
        const ticker = this.checkForTickerSymbol();
        if (ticker) {
            this.matchedTickerSymbol = ticker;
            return this.getTickerSymbolIfPresent();
        }
        const companyName = this.checkForCompanyName();
        if (companyName) {
            const ticker = lookupTickerByCompanyName(companyName);
            if (ticker) {
                this.matchedTickerSymbol = ticker;
                return this.getTickerSymbolIfPresent();
            }
        }
        return '';
    }

    public getTickerSymbolIfPresent() {
        return this.matchedTickerSymbol;
    }

    private tokenizeString() {
        this.tokenizedInputString = standardizeInput(this.stringToAnalyze);
    }

    private checkForCompanyName() {
        let extractedCompanyName;
        this.tokenizedInputString.some((word, index) => {
            if (index % 2 === 0) {
                const str = this.tokenizedInputString.slice(index - 2, index + 1).join(' ');
                const company = isCompanyName(str, .1);
                if (company.isMatch) {
                    extractedCompanyName = company.name;
                    return true;
                }
            }
            if (index % 3 === 0) {
                const str = this.tokenizedInputString.slice(index - 3, index + 1).join(' ');
                const company = isCompanyName(str, .1);
                if (company.isMatch) {
                    extractedCompanyName = company.name;
                    return true;
                }
            }
            const company = isCompanyName(word, .1);
            if (company.isMatch) {
                extractedCompanyName = company.name;
                return true;
            }
            return false;
        });
        return extractedCompanyName;
    }

    private checkForTickerSymbol(): string {
        let extractedTickerSymbol;
        this.tokenizedInputString.some((word) => {
            const ticker = isTickerSymbol(word, {
                output: true,
                matchTolerance: this.matchTolerance
            });
            if (ticker && _.isString(ticker)) {
                extractedTickerSymbol = ticker;
            }
            return !!ticker;
        });
        return extractedTickerSymbol;
    }

    private setMatchTolerance(desiredTolerance: number) {
        if (!desiredTolerance || desiredTolerance > 1) {
            return -1;
        }
        return _.round(1 - desiredTolerance, 2);
    }
};
