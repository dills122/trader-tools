import watchlist from './lib/watchlist.config';
import * as util from './lib/util';
import * as Emailer from './lib/emailer';
import BollingerBands from './lib/bollinger-bands';
import * as Strategies from './lib/strategies';
import * as LinkGenerator from './lib/link-generator';

export default {
  watchlist,
  util,
  Emailer,
  BollingerBands,
  Strategies,
  LinkGenerator
};

export { watchlist, util, Emailer, BollingerBands, Strategies, LinkGenerator };
