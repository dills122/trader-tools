import _ from 'lodash';
const { BollingerBands: BB, CrossUp, CrossDown, SMA } = require('technicalindicators');
import { BollingerBands } from './bb';

const dependencies = {
    BollingerBands: BB,
    CrossUp,
    CrossDown,
    SMA
};

const peroid = 20;
const stdDev = 2;

export interface BBArgs {
    peroid?: number,
    stdDev?: number,
    dataPoints: number[]
};

export const CrossOver = (args: BBArgs) => {
    const bands: BollingerBands = dependencies.BollingerBands.calculate({
        peroid: args.peroid || peroid,
        stdDev: args.stdDev || stdDev,
        values: args.dataPoints
    });
    if (bands.length <= 0) {
        return;
    }

    const sma: number[] = dependencies.SMA.calculate({
        period: peroid,
        values: args.dataPoints
    });

    const upperBound: boolean[] = dependencies.CrossUp.calculate({
        lineB: _.map(bands, 'upper'),
        lineA: sma
    });

    const isCrossOverUpperBound = _.some(upperBound, (v) => v);

    const lowerBound: boolean[] = dependencies.CrossDown.calculate({
        lineA: sma,
        lineB: _.map(bands, 'lower')
    });

    const isCrossOverLowerBound = _.some(lowerBound, (v) => v);

    if (!isCrossOverLowerBound && !isCrossOverUpperBound) {
        return;
    }

    if (isCrossOverLowerBound && isCrossOverUpperBound) {
        return;
    }

    if (isCrossOverUpperBound) {
        return 'upwards';
    }

    return 'downwards';
};
