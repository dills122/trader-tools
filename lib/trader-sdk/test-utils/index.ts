/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import _ from 'lodash';
import { Candle, CandleCollection } from '../lib/candles/candles';


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

export function generateArrayOfNumbers(length: number, seedNumber: number = Math.random() * 10, bufferValue = 0) {
    const numbers: number[] = [];
    for (let i = 0; i < length; i++) {
        const buffer = Math.random() * bufferValue;
        numbers.push(buffer ? seedNumber - buffer : seedNumber);
    }
    return numbers;
}