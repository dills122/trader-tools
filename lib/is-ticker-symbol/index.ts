import config from './config.json';
import Fuse from 'fuse.js';
import _ from 'lodash';

const configCache = config;

if (configCache.symbols.length <= 0 ||
    Object.keys(configCache.json).length <= 0) {
    throw Error('Unable to proceed, config data is empty, this is a maintainer issue');
}

export interface Options {
    output?: boolean,
    matchTolerance?: number
};

/**
 * Checks if a given string matches a public companies ticker symbol
 * @param symbol string checking against company database
 * @param options optional settings to change functionality of matching, output
 * @returns true if match found, false else
 */
export const isTickerSymbol = (symbol: string, options: Options = {}) => {
    const symbols = configCache.symbols as string[];
    if (options.output) {
        const fuse = new Fuse(symbols, {
            threshold: options.matchTolerance || .2
        });
        const matches = fuse.search(symbol);
        if (matches.length <= 0) {
            return false;
        }
        const match = _.chain(matches)
            .orderBy(['score'], ['asc'])
            .first()
            .value();
        return <string>match.item;
    }
    return symbols.includes(symbol);
};

/**
 * Checks a string to see if it matches a publicly traded company name
 * @param inputString string checking against company database
 * @param matchTolerance optional, set match tolerance; 0 perfect match, 1 mismatch
 * @returns true if match found, false else
 */
export const isCompanyName = (inputString: string, matchTolerance = .2): {
    isMatch: boolean,
    name: string
} => {
    const names = configCache.json.map(company => company.name);
    const fuse = new Fuse(names, {
        threshold: matchTolerance
    });
    const matches = fuse.search(inputString);
    if (matches.length <= 0) {
        return {
            isMatch: false,
            name: ''
        };
    }
    const match = _.chain(matches)
        .orderBy(['score'], ['asc'])
        .first()
        .value();
    return {
        isMatch: true,
        name: <string>match.item
    };
};

export const lookupTickerByCompanyName = (companyName: string): string => {
    const tickerSymbolData = getTickerSymbolDetailList();
    const isCompany = isCompanyName(companyName);
    if (!isCompany.isMatch) {
        return '';
    }
    const tickerData = _.find(tickerSymbolData, { name: isCompany.name });
    if(!tickerData) {
        return '';
    }
    return tickerData.symbol;
};

//TODO create a less strict mode, fuzzy match type checking

export const getTickerSymbols = () => configCache.symbols as string[];

export const getTickerSymbolDetailList = () => configCache.json;
