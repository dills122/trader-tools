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

export class MFI {
    protected highPrices: number[];
    protected lowPrices: number[];
    protected closePrices: number[];
    protected volumeAmounts: number[];
    protected period: number = config.period;
    protected mfis: number[];
    protected averageMfi: number;
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
        this.calculateAverageMfi();
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

    getAverageMfi() {
        return this.averageMfi;
    }

    private calculateAverageMfi() {
        const numberOfMfis = this.mfis.length;
        this.averageMfi = _.chain(this.mfis).sum().divide(numberOfMfis).round(2).value();
    }
}