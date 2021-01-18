import * as _ from 'lodash';
import watchlist from './watchlist.config';

export const getWatchlist = (): string[] => {
    return _.keys(watchlist);
}