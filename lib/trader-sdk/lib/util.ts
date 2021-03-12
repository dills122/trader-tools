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

export const calculatePercentDifference = (valueOne, valueTwo) => {
    return (Math.abs(valueOne - valueTwo) / ((valueTwo + valueOne) / 2)) * 100;
};

export const isWithinGivenBuffer = (valueToCompare: number, valueComparingAganist: number, bufferValue: number): boolean => {
    const buffer = _.round((bufferValue / 100) * valueComparingAganist, 2)
    const lowerBound = valueComparingAganist - buffer;
    const upperBound = valueComparingAganist + buffer;
    return lowerBound <= valueToCompare && upperBound >= valueToCompare;
};

export const sliceArrayByFullChunks = (arry: any[], chunkSize: number, shouldReverse: boolean = false) => {
    const maxChunks = _.round(arry.length / chunkSize);
    const fullLength = chunkSize * maxChunks;
    if (shouldReverse) {
        return _.slice(arry, arry.length - fullLength);
    }
    return _.slice(arry, 0, fullLength);
};

export const shuffleArray = (array: number[]): number[] => {
    let i = array.length,
        j = 0,
        temp;

    while (i--) {
        j = Math.floor(Math.random() * (i + 1));

        // swap randomly chosen element with current element
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}