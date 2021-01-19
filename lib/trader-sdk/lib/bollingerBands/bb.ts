import _ from 'lodash';
import { calculatePercentType } from '../util';
const { BollingerBands, CrossOver } = require('technicalindicators');

const peroid = 20;
const stdDev = 2;

const crossOverMin = 65;

export interface BBArgs {
    peroid?: number,
    stdDev?: number,
    dataPoints: number[]
};

export interface Band {
    lower: number,
    middle: number,
    upper: number
};

export type BollingerBands = Array<Band>;

export const BB = (args: BBArgs) => {
    const bands: BollingerBands = BollingerBands.calculate({
        peroid: args.peroid || peroid,
        stdDev: args.stdDev || stdDev,
        values: args.dataPoints
    });
    if (bands.length <= 0) {
        return 'neutral';
    }
    const upperBound: boolean[] = CrossOver.calculate({
        lineA: _.map(bands, 'upper'),
        lineB: _.map(bands, 'middle')
    });

    const isCrossOverUpperBound = calculatePercentType(upperBound, true) >= crossOverMin;

    const lowerBound: boolean[] = CrossOver.calculate({
        lineA: _.map(bands, 'middle'),
        lineB: _.map(bands, 'lower')
    });

    const isCrossOverLowerBound = calculatePercentType(lowerBound, true) >= crossOverMin;

    if (!(isCrossOverLowerBound && isCrossOverUpperBound)) {
        return 'neutral';
    }

    if (isCrossOverLowerBound && isCrossOverUpperBound) {
        //Not sure what to do with this one
    }

    if (isCrossOverUpperBound) {
        return 'upwards';
    }

    return 'downwards';
};
