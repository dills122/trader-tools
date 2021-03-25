import _ from 'lodash';
import { CandleCollection } from '../candles/candles';
import SMA from '../sma';
import { CrossDown, CrossUp } from 'technicalindicators';

const dependencies = {
    CrossUp,
    CrossDown
};

export const config = {
    fastPeriod: 50,
    slowPeriod: 200
};

export interface FastSlowSMACrossOverArgs {
    candles: CandleCollection
}

export class FastSlowSMACrossOver {
    private candles: CandleCollection;
    private fastPeriodSMAs: number[] = [];
    private slowPeriodSMAs: number[] = [];
    constructor(args: FastSlowSMACrossOverArgs) {
        _.assign(this, args);
        this.calculateSMAs();
    }

    private calculateSMAs() {
        const fastPeriodChunks = _.chunk(this.candles, config.fastPeriod);
        const slowPeriodChunks = _.chunk(this.candles, config.slowPeriod);
        fastPeriodChunks.forEach((chunk) => {
            this.fastPeriodSMAs.push(this.calculateFastPeriodSMA(chunk));
        });
        slowPeriodChunks.forEach((chunk) => {
            this.slowPeriodSMAs.push(this.calculateSlowPeriodSMA(chunk));
        });
    }

    private calculateFastPeriodSMA(periodCandles: CandleCollection) {
        return new SMA({ candles: periodCandles, period: config.fastPeriod }).getSMAForPeriod();
    }

    private calculateSlowPeriodSMA(periodCandles: CandleCollection) {
        return new SMA({ candles: periodCandles, period: config.slowPeriod }).getSMAForPeriod();
    }

    hasRecentCrossUp(): boolean {
        const recentSegmentLength = _.min([this.slowPeriodSMAs.length, 2]) || 0;
        const slowSlice = _.chain(this.slowPeriodSMAs)
            .clone()
            .slice(this.slowPeriodSMAs.length - recentSegmentLength, this.slowPeriodSMAs.length)
            .value();
        return _.some(slowSlice, (slowSMA, index) => {
            return slowSMA > this.fastPeriodSMAs[this.fastPeriodSMAs.length - index - 1];
        });
    }

    hasRecentCrossDown(): boolean {
        const recentSegmentLength = _.min([this.slowPeriodSMAs.length, 2]) || 0;
        const slowSlice = _.chain(this.slowPeriodSMAs)
            .clone()
            .slice(this.slowPeriodSMAs.length - recentSegmentLength, this.slowPeriodSMAs.length)
            .value();

        return _.some(slowSlice, (slowSMA, index) => {
            return slowSMA < this.fastPeriodSMAs[this.fastPeriodSMAs.length - index - 1];
        });
    }

    hasCrossUp(): boolean {
        const crossUpValues = dependencies.CrossUp.calculate({
            lineA: this.slowPeriodSMAs,
            lineB: this.fastPeriodSMAs
        });
        return _.some(crossUpValues, (up) => up);
    }

    hasCrossDown(): boolean {
        const crossDownValues = dependencies.CrossDown.calculate({
            lineA: this.slowPeriodSMAs,
            lineB: this.fastPeriodSMAs
        });
        return _.some(crossDownValues, (up) => up);
    }
}

export default FastSlowSMACrossOver;