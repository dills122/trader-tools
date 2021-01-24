import { Band, BollingerBands, BollingerBandsArgs } from './bollinger-bands';
import _ from 'lodash';
import { isWithinGivenBuffer } from '../util';

export class BandWidth extends BollingerBands {
    protected bandWidths: number[] = [];
    protected percentBs: number[] = [];
    protected averageBandWidthOverPeriod: number = 0;
    protected averagePercentBOverPeriod: number = 0;
    constructor(args: BollingerBandsArgs) {
        super(args);
        this.calculateBandWidthsOverPeriod();
        this.calculatePercentBsOverPeriod();
        this.calculateAverageBandwidth();
        this.calculateAveragePercentB();
    }

    private calculateBandWidthsOverPeriod() {
        _.each(this.bands, (band) => {
            this.bandWidths.push(this.calculateBandWidth(band));
        });
    }

    private calculatePercentBsOverPeriod() {
        _.each(this.bands, (band, currentIndex) => {
            this.percentBs.push(this.calculatePercentB(band, this.periodData[currentIndex]));
        });
    }

    private calculateBandWidth(band: Band) {
        const { lower, middle, upper } = band;
        return _.round((upper - lower) / middle * 100, 2);
    }

    private calculatePercentB(band: Band, priceAtBand: number) {
        const { lower, upper } = band;
        return _.round((priceAtBand - lower) / (upper - lower), 2);
    }

    private calculateAverageBandwidth() {
        this.averageBandWidthOverPeriod = _.chain(this.bandWidths)
        .sum()
        .divide(this.bandWidths.length)
        .round(2)
        .value();
    }

    private calculateAveragePercentB() {
        this.averagePercentBOverPeriod = _.chain(this.percentBs)
        .sum()
        .divide(this.percentBs.length)
        .round(2)
        .value();
    }

    getAverageBandwidth() {
        return this.averageBandWidthOverPeriod;
    }

    getAveragePercentB() {
        return this.averagePercentBOverPeriod;
    }

    /**
     * calculates if the bands are narrowing, signaling lower volatility
     */
    hasNarrowingBandwidth() {
        const downwardTrendsInARow: number[] = [];
        let downwardTrendCount: number = 0;
        for (let i = 0; i < this.bandWidths.length; i++) {
            const bandWidth = this.bandWidths[i];
            const lastValue = this.bandWidths[i === 0 ? i : i - 1];
            if (bandWidth < lastValue) {
                downwardTrendCount++;
                continue;
            }
            if (downwardTrendCount !== 0) {
                downwardTrendsInARow.push(downwardTrendCount);
                downwardTrendCount = 0;
            }
        }
        const thirdOfPeriod = this.period / 3;
        const totalBandsTrendingNarrow = _.sum(downwardTrendsInARow);
        if (totalBandsTrendingNarrow === 0) {
            return false;
        }
        return isWithinGivenBuffer(totalBandsTrendingNarrow, thirdOfPeriod, 10);
    }

    /**
     * calculates if there was any points to signal an over buy
     */
    isOverBought() {
        let overBoughtSignals: number = 0;
        _.each(this.percentBs, (percentB) => {
            if (isWithinGivenBuffer(percentB, 1, 2) || percentB > 1) {
                overBoughtSignals++;
            }
        });
        return overBoughtSignals > 0;
    }

    /**
     * calculates if there was any points to signal an over sell
     */
    isOverSold() {
        let overSoldSignals: number = 0;
        _.each(this.percentBs, (percentB) => {
            if (isWithinGivenBuffer(percentB, 0, 2) || percentB < 0) {
                overSoldSignals++;
            }
        });
        return overSoldSignals > 0;
    }
};