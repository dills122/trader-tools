import * as _ from 'lodash';
import watchlist from './watchlist.config';

export const getWatchlist = (): string[] => {
    return _.keys(watchlist);
}

export const asyncFilter = async (arr, predicate) => {
    const results = await Promise.all(arr.map(predicate));

    return arr.filter((_v, index) => results[index]);
};