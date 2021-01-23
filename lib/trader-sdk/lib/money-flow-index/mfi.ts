import _ from 'lodash';
import config from './money-flow.index.config';
const { MFI: MFIIndicator } = require('technicalindicators');

const dependencies = {
    MFIIndicator
};

export interface MFIArgs {
    highPrices: number[],
    lowPrices: number[],
    closePrices: number[],
    volumeAmounts: number[],
    period?: number
}

export default class MFI {
    protected highPrices: number[];
    protected lowPrices: number[];
    protected closePrices: number[];
    protected volumeAmounts: number[];
    protected period: number = config.period;
    protected mfis: number[];
    constructor(args: MFIArgs) {
        _.assign(this, args);
        this.calculateMfis();
    }

    private calculateMfis() {
        this.mfis = dependencies.MFIIndicator.calculate({
            high: this.highPrices,
            low: this.lowPrices,
            close: this.closePrices,
            volume: this.volumeAmounts,
            period: this.period
        });
    }

    getMfisOverPeriod() {
        return this.mfis;
    }

    setOrUpdatePeriod(period: number) {
        this.period = period;
    }

    getPeriod() {
        return this.period;
    }
}