import _ from 'lodash';
import config from './bollinger-bands.config';
const { BollingerBands: BB, CrossUp, CrossDown, SMA } = require('technicalindicators');

const dependencies = {
    BollingerBands: BB,
    CrossUp,
    CrossDown,
    SMA
};

export interface Band {
    lower: number,
    middle: number,
    upper: number
};

// export type BollingerBands = Array<Band>;

export interface BollingerBandsArgs {
    peroid?: number,
    stdDev?: number,
    peroidData: number[]
};

export class BollingerBands {
    protected peroid: number;
    protected stdDev: number;
    protected peroidData: number[];
    protected bands: Band[];
    protected sma: number[];
    constructor(args: BollingerBandsArgs) {
        _.assign(this, {
            peroid: args.peroid || config.peroid,
            stdDev: args.stdDev || config.stdDev,
            peroidData: args.peroidData
        });
        this.bands = dependencies.BollingerBands.calculate({
            peroid: this.peroid,
            stdDev: this.stdDev,
            values: this.peroidData
        });
        this.sma = dependencies.SMA.calculate({
            period: this.peroid,
            values: this.peroidData
        });
    }
}