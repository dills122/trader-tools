import _ from 'lodash';
import { BandWidth } from '../bollinger-bands';
import { MFI } from '../money-flow-index';
import { isWithinGivenBufferOrGreater } from '../util';

const dependencies = {
    BandWidth,
    MFI
};

export interface PercentBMFIIndicatorArgs {
    highPrices: number[],
    lowPrices: number[],
    closePrices: number[],
    volumeAmounts: number[],
    period?: number,
    stdDev?: number
};

export class PercentBMFIIndicator {
    private highPrices: number[];
    private lowPrices: number[];
    private closePrices: number[];
    private volumeAmounts: number[];
    private period: number;
    private stdDev: number;
    public mfiClass: MFI.MFI;
    public bbWidthClass: BandWidth;
    constructor(args: PercentBMFIIndicatorArgs) {
        _.assign(this, args);
        this.bbWidthClass = new dependencies.BandWidth({
            periodData: this.closePrices,
            period: this.period,
            stdDev: this.stdDev
        });
        this.setOrUpdatePeriod(this.bbWidthClass.getPeriod());
        this.mfiClass = new dependencies.MFI.MFI({
            closePrices: this.closePrices,
            lowPrices: this.lowPrices,
            highPrices: this.highPrices,
            volumeAmounts: this.volumeAmounts,
            period: this.getPeriod()
        });
    }

    setOrUpdatePeriod(period: number) {
        this.period = period;
    }

    getPeriod() {
        return this.period;
    }

    setOrUpdateStandardDeviation(stdDev: number) {
        this.stdDev = stdDev;
    }

    getStandardDeviation() {
        return this.stdDev;
    }

    hasUpwardTrend() {
        return isWithinGivenBufferOrGreater(this.mfiClass.getAverageMfi(), 80, 2) &&
            isWithinGivenBufferOrGreater(this.bbWidthClass.getAveragePercentB(), .80, 2);
    }
}