import { Band, BollingerBands, BollingerBandsArgs } from './bollinger-bands';
import _ from 'lodash';
import { isWithinGivenBuffer } from '../util';

export class BandWidth extends BollingerBands {
    protected bandWidths: number[] = [];
    protected percentBs: number[] = [];
    protected averageBandWidthOverPeroid: number = 0;
    constructor(args: BollingerBandsArgs) {
        super(args);
        this.calculateBandWidthsOverPeroid();
        this.calculatePercentBsOverPeroid();
        this.calculateAverageBandwidth();
    }

    private calculateBandWidthsOverPeroid() {
        _.each(this.bands, (band) => {
            this.bandWidths.push(this.calculateBandWidth(band));
        });
    }

    private calculatePercentBsOverPeroid() {
        _.each(this.bands, (band, currentIndex) => {
            this.percentBs.push(this.calculatePercentB(band, this.peroidData[currentIndex]));
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
        this.averageBandWidthOverPeroid = sumOfBandWidths / this.peroid;
    }

    getAverageBandwidth() {
        return this.averageBandWidthOverPeroid;
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
        const thirdOfPeroid = this.peroid / 3;
        const totalBandsTrendingNarrow = _.sum(downwardTrendsInARow);
        if (totalBandsTrendingNarrow === 0) {
            return false;
        }
        return isWithinGivenBuffer(totalBandsTrendingNarrow, thirdOfPeroid, 10);
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