import _ from "lodash";
import { CandleCollection } from "./candles";

export interface BaseIndicatorArgs {
    candles: CandleCollection,
    period?: number
};

export default class BaseIndicator {
    protected candles: CandleCollection;
    protected period: number;
    constructor(args: BaseIndicatorArgs) {
        _.assign(this, args);
        this.calculatePeriod(this.period);
    }

    setOrUpdateCandles(candles: CandleCollection) {
        this.candles = candles;
    }

    getCandles() {
        return this.candles;
    }

    getClosePrices() {
        return _.map(this.candles, 'close');
    }

    getLowPrices() {
        return _.map(this.candles, 'low');
    }

    getHighPrices() {
        return _.map(this.candles, 'high');
    }

    getVolumeAmount() {
        return _.map(this.candles, 'volume');
    }

    private calculatePeriod(period: number) {
        this.period = period || this.candles.length;
    }
}