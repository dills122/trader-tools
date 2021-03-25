import _ from "lodash";
import BaseIndicator, { BaseIndicatorArgs } from "../base-indicator";
import { SMA as SMAIndicator } from 'technicalindicators';

const dependencies = {
    SMA: SMAIndicator
};

export default class SMA extends BaseIndicator {
    private sma: number;
    constructor(args: BaseIndicatorArgs) {
        super(args);
        this.sma = _.last(dependencies.SMA.calculate({
            period: this.period,
            values: this.getClosePrices()
        })) || 0;
    }

    getSMAForPeriod(): number {
        return this.sma;
    }
}