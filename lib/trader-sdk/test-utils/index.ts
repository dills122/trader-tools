import _ from 'lodash';
import { Candle, CandleCollection } from '../lib/candles';


export function buildUniformCandlesFromArray(arrayOfNumbers: number[]) {
    return _.map(arrayOfNumbers, (num: number) => {
        return {
            high: num,
            low: num,
            close: num,
            open: num,
            volume: num * 1000
        } as Candle;
    });
}

export function buildCandlesFromArrays({
    highPrices,
    lowPrices,
    closePrices,
    volumeAmounts,
}: {
    highPrices: number[],
    lowPrices: number[],
    closePrices: number[],
    volumeAmounts: number[],
}) {
    if (highPrices.length !== lowPrices.length ||
        lowPrices.length !== closePrices.length ||
        closePrices.length !== volumeAmounts.length ||
        volumeAmounts.length !== highPrices.length) {
        return [];
    }
    const candles: CandleCollection = [];
    for (let i = 0; i < closePrices.length; i++) {
        candles.push({
            high: highPrices[i],
            low: lowPrices[i],
            close: closePrices[i],
            open: closePrices[i], //Need to fix later since this didnt exist before
            volume: volumeAmounts[i]
        })
    }
    return candles;
}