import _ from 'lodash';
import BaseIndicator, { BaseIndicatorArgs } from '../base-indicator';
import config from './money-flow.index.config';
const { MFI: MFIIndicator } = require('technicalindicators');

const dependencies = {
    MFIIndicator
};

export interface MFIArgs extends BaseIndicatorArgs { };

export default class MFI extends BaseIndicator {
    protected mfis: number[];
    constructor(args: MFIArgs) {
        super({
            period: config.period,
            ...args,
        } as BaseIndicatorArgs);
        _.assign(this, args);
        this.calculateMfis();
    }

    private calculateMfis() {
        this.mfis = dependencies.MFIIndicator.calculate({
            high: this.getHighPrices(),
            low: this.getLowPrices(),
            close: this.getClosePrices(),
            volume: this.getVolumeAmount(),
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