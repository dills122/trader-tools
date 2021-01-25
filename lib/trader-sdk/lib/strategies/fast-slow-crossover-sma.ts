import _ from 'lodash';
import { CandleCollection } from '../candles';
import SMA from '../sma';

const config = {
    fastPeriod: 50,
    slowPeriod: 200
};

export interface FastSlowSMACrossOverArgs {
    candles: CandleCollection
};

export default class FastSlowSMACrossOver {
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

    hasRecentCrossUp() {
        const recentSegmentLength = _.min([this.slowPeriodSMAs.length, 2]) || 0;
        const slowSplice = _.chain(this.slowPeriodSMAs)
            .clone()
            .slice(this.slowPeriodSMAs.length - recentSegmentLength, this.slowPeriodSMAs.length)
            .value();
        const tmpFastPeriodSMAs = _.clone(this.fastPeriodSMAs);
        return slowSplice.some((slowSMA) => {
            const fastSMA = tmpFastPeriodSMAs.pop() || 0;
            return fastSMA > slowSMA;
        });
    }

    hasRecentCrossDown() {
        const recentSegmentLength = _.min([this.slowPeriodSMAs.length, 2]) || 0;
        const slowSplice = _.chain(this.slowPeriodSMAs)
            .clone()
            .slice(this.slowPeriodSMAs.length - recentSegmentLength, this.slowPeriodSMAs.length)
            .value();
        const tmpFastPeriodSMAs = _.clone(this.fastPeriodSMAs);
        return slowSplice.some((slowSMA) => {
            const fastSMA = tmpFastPeriodSMAs.pop() || 0;
            return fastSMA < slowSMA;
        });
    }
}