import _ from "lodash";
import BaseIndicator, { BaseIndicatorArgs } from "../base-indicator";
const {  SMA: SMAIndicator } = require('technicalindicators');

const dependencies = {
    SMAIndicator
};

export default class SMA extends BaseIndicator {
    private sma: number;
    constructor(args: BaseIndicatorArgs) {
        super(args);
        this.sma = _.last(dependencies.SMAIndicator.calculate({
            period: this.period,
            values: this.getClosePrices()
        })) || 0;
    }

    getSMAForPeriod() {
        return this.sma;
    }
};