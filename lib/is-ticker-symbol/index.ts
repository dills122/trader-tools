import config from './config.json';
// import Fuzzy from 'fuzzyset';
import Fuse from 'fuse.js';
import _ from 'lodash';

const configCache = config;

if (configCache.symbols.length <= 0 ||
    Object.keys(configCache.json).length <= 0) {
    throw Error('Unable to proceed, config data is empty, this is a maintainer issue');
}

/**
 * Checks if a given string matches a public companies ticker symbol
 * @param symbol string checking against company database
 * @returns true if match found, false else
 */
export const isTickerSymbol = (symbol: string) => {
    const symbols = configCache.symbols as string[];
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
    // const set = Fuzzy(names);
    // const matches = set.get(inputString);
    // if (!matches || matches.length <= 0) {
    //     return false;
    // }
    // return matches.map((match) => {
    //     return {
    //         percent: match[0],
    //         name: match[1]
    //     };
    // }).some(match => match.percent >= matchTolerance);
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

//TODO create a less strict mode, fuzzy match type checking

export const getTickerSymbols = () => configCache.symbols as string[];

export const getTickerSymbolDetailList = () => configCache.json;
