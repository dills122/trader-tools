import * as _ from 'lodash';
import watchlist from './watchlist.config';

export const getWatchlist = (): string[] => {
    return _.keys(watchlist);
}

export const asyncFilter = async (arr, predicate) => {
    const results = await Promise.all(arr.map(predicate));

    return arr.filter((_v, index) => results[index]);
};

export const calculatePercentType = (arry: boolean[], bit: boolean) => {
    const recordCount = arry.length;
    let total = 0;
    _.each(arry, (value) => {
        if (value === bit) {
            total += 1;
        }
    });
    return _.round(total / recordCount * 100, 2);
};