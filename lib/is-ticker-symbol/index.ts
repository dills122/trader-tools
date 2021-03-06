import config from './config.json';

const configCache = config;

if (configCache.symbols.length <= 0 ||
    Object.keys(configCache.json).length <= 0) {
    throw Error('Unable to proceed, config data is empty, this is a maintainer issue');
}

export const isTickerSymbol = (symbol: string) => {
    const symbols = configCache.symbols as string[];
    return symbols.includes(symbol);
};

//TODO create a less strict mode, fuzzy match type checking

export const getTickerSymbols = () => configCache.symbols as string[];

export const getTickerSymbolDetailList = () => configCache.json;