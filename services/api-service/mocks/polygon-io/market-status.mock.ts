import _ from 'lodash';
import { MarketStatusResponse } from '../../lib/polygon-io/market-status.service';

export const MarketStatusResponseBase: MarketStatusResponse = {
  market: 'extended-hours',
  serverTime: '2020-11-10T22:37:37.000Z',
  exchanges: {
    nyse: 'extended-hours',
    nasdaq: 'extended-hours',
    otc: 'closed'
  },
  currencies: {
    fx: 'open',
    crypto: 'open'
  }
};

export const getMarketStatus = () => {
  return _.cloneDeep(MarketStatusResponseBase);
};
