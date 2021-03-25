import { Band, BollingerBands, BollingerBandsArgs } from './bollinger-bands';
import _ from 'lodash';
import { isWithinGivenBuffer } from '../util';

export class BandWidth extends BollingerBands {
    protected bandWidths: number[] = [];
    protected percentBs: number[] = [];
    protected averageBandWidthOverPeriod = 0;
    constructor(args: BollingerBandsArgs) {
        super(args);
        this.calculateBandWidthsOverPeriod();
        this.calculatePercentBsOverPeriod();
        this.calculateAverageBandwidth();
    }

    private calculateBandWidthsOverPeriod() {
        _.each(this.bands, (band) => {
            this.bandWidths.push(this.calculateBandWidth(band));
        });
    }

    private calculatePercentBsOverPeriod() {
        _.each(this.bands, (band, currentIndex) => {
            this.percentBs.push(this.calculatePercentB(band, this.getClosePrices()[currentIndex]));
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
        const sumOfBandWidths = _.sum(this.bandWidths);
        this.averageBandWidthOverPeriod = sumOfBandWidths / this.period;
    }

    getAverageBandwidth(): number {
        return this.averageBandWidthOverPeriod;
    }

    /**
     * calculates if the bands are narrowing, signaling lower volatility
     */
    hasNarrowingBandwidth(): boolean {
        const downwardTrendsInARow: number[] = [];
        let downwardTrendCount = 0;
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
    isOverBought(): boolean {
        let overBoughtSignals = 0;
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
    isOverSold(): boolean {
        let overSoldSignals = 0;
        _.each(this.percentBs, (percentB) => {
            if (isWithinGivenBuffer(percentB, 0, 2) || percentB < 0) {
                overSoldSignals++;
            }
        });
        return overSoldSignals > 0;
    }
}