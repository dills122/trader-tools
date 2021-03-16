import _ from "lodash";
import { isCompanyName, isTickerSymbol } from 'is-ticker-symbol';
import { standardizeInput } from '../../standardize-input';

export interface EquityFilterArgs {
    stringToAnalyze: string,
    matchTolerance?: number
};

export class EquityFilter {
    stringToAnalyze: string;
    matchTolerance: number = .2;
    tokenizedInputString: string[];
    constructor(args: EquityFilterArgs) {
        this.stringToAnalyze = args.stringToAnalyze;
        if (args.matchTolerance) {
            this.matchTolerance = this.setMatchTolerance(args.matchTolerance);
        }
    }

    filter() {

    }

    private tokenizeString() {
        this.tokenizedInputString = standardizeInput(this.stringToAnalyze);
    }

    private checkForCompanyName() {

    }

    private checkForTickerSymbol() {
        let extractedTickerSymbol;
        const isTicker = this.tokenizedInputString.some((word) => {

            const hasTicker = isTickerSymbol(word);
        });
    }

    private setMatchTolerance(desiredTolerance: number) {
        if (!desiredTolerance || desiredTolerance > 1) {
            return -1;
        }
        return _.round(1 - desiredTolerance, 2);
    }
};
