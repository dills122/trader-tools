import _ from 'lodash';
import BaseIndicator, { BaseIndicatorArgs } from '../base-indicator';
import config from './bollinger-bands.config';
const { BollingerBands: BB, SMA } = require('technicalindicators');

const dependencies = {
    BollingerBands: BB,
    SMA
};

export interface Band {
    lower: number,
    middle: number,
    upper: number
};

export interface BollingerBandsArgs extends BaseIndicatorArgs {
    stdDev?: number
};

export class BollingerBands extends BaseIndicator {
    protected stdDev: number;
    protected bands: Band[];
    protected sma: number[];
    constructor(args: BollingerBandsArgs) {
        super(args as BaseIndicatorArgs);
        _.assign(this, {
            period: args.period || config.period,
            stdDev: args.stdDev || config.stdDev,
            periodData: this.getClosePrices()
        });
        this.bands = dependencies.BollingerBands.calculate({
            period: this.period,
            stdDev: this.stdDev,
            values: this.getClosePrices()
        });
        this.sma = dependencies.SMA.calculate({
            period: this.period,
            values: this.getClosePrices()
        });
    }

    setOrUpdatePeriod(period: number) {
        this.period = period;
    }

    getPeriod() {
        return this.period;
    }

    setOrUpdateStandardDeviation(stdDev: number) {
        this.stdDev = stdDev;
    }

    getStandardDeviation() {
        return this.stdDev;
    }
}