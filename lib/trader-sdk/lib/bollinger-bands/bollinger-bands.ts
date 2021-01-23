import _ from 'lodash';
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

export interface BollingerBandsArgs {
    period?: number,
    stdDev?: number,
    periodData: number[]
};

export class BollingerBands {
    protected period: number;
    protected stdDev: number;
    protected periodData: number[];
    protected bands: Band[];
    protected sma: number[];
    constructor(args: BollingerBandsArgs) {
        _.assign(this, {
            period: args.period || config.period,
            stdDev: args.stdDev || config.stdDev,
            periodData: args.periodData
        });
        this.bands = dependencies.BollingerBands.calculate({
            period: this.period,
            stdDev: this.stdDev,
            values: this.periodData
        });
        this.sma = dependencies.SMA.calculate({
            period: this.period,
            values: this.periodData
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