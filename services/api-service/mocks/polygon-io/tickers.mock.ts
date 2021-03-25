import _ from 'lodash';
import { RawTickerPageResponse, TickerSymbolResponse } from '../../lib/polygon-io/tickers.service';

const RawTickerPageResponseBase: RawTickerPageResponse = {
  page: 1,
  perPage: 50,
  count: 200,
  status: 'OK',
  tickers: []
};

const TickerSymbolResponseBase: TickerSymbolResponse = {
  ticker: '',
  name: '',
  market: '',
  locale: '',
  currency: '',
  active: true,
  primaryExch: '',
  type: '',
  codes: {
    code: 'code'
  },
  updated: '03-03-21',
  url: 'url.fake'
};

export const getListOfTickerSymbols = (symbols: string[]) => {
  const symbolList: TickerSymbolResponse[] = [];
  for (const symbol in symbols) {
    const cloned = _.cloneDeep(TickerSymbolResponseBase);
    cloned.ticker = symbol;
    symbolList.push(cloned);
  }
  return symbolList;
};

export const getRawTickerPageResponse = (symbols: string[]) => {
  const cloned = _.cloneDeep(RawTickerPageResponseBase);
  cloned.tickers = _.cloneDeep(getListOfTickerSymbols(symbols));
  return cloned;
};
