import { BollingerBands, BollingerBandsArgs } from './bollinger-bands';
const { CrossUp, CrossDown } = require('technicalindicators');
import _ from 'lodash';

const dependencies = {
    CrossUp,
    CrossDown
};

export class CrossOver extends BollingerBands {
    private upperBoundCrossover: boolean[];
    private lowerBoundCrossover: boolean[];
    constructor(args: BollingerBandsArgs) {
        super(args);

        const middleBand = _.map(this.bands, 'middle');

        this.upperBoundCrossover = dependencies.CrossUp.calculate({
            lineB: middleBand,
            lineA: this.sma
        });

        this.lowerBoundCrossover = dependencies.CrossDown.calculate({
            lineA: this.sma,
            lineB: middleBand
        });
    }

    isCrossingDown() {
        return _.some(this.lowerBoundCrossover, (v) => v);
    }

    isCrossingUp() {
        return _.some(this.upperBoundCrossover, (v) => v);
    }
};