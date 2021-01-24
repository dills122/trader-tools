import { describe } from 'mocha';
import { assert, expect } from 'chai';
import _ from 'lodash';
import {MFI} from '../../lib/money-flow-index/mfi';
import config from '../../lib/money-flow-index/money-flow.index.config';
import { FourteenDayPeriod } from '../../mocks/mfi.mock';

describe('Bollinger Bands::', function () {

    it('Happy path 14 period', () => {
        const mfi = new MFI({
            highPrices: FourteenDayPeriod.high,
            lowPrices: FourteenDayPeriod.low,
            closePrices: FourteenDayPeriod.close,
            volumeAmounts: FourteenDayPeriod.volume,
            period: 14
        });
        assert(mfi);
        const mfiOverPeriod = mfi.getMfisOverPeriod();
        assert.isAbove(mfiOverPeriod.length, 0);
        assert.isBelow(mfiOverPeriod.length, 10);
        expect(mfi.getPeriod()).to.equal(config.period);
        expect(mfi.getAverageMfi()).to.be.greaterThan(30);
    });

    it('Happy path 20 period', () => {
        const mfi = new MFI({
            highPrices: [25.03, 24.91, 24.89, 25.13, 25.00, 25.01, 25.1, ...FourteenDayPeriod.high],
            lowPrices: [25.03, 24.91, 24.89, 25.13, 25.00, 25.01, 25.1, ...FourteenDayPeriod.low],
            closePrices: [25.03, 24.91, 24.89, 25.13, 25.00, 25.01, 25.1, ...FourteenDayPeriod.close],
            volumeAmounts: [5673, 5625, 5023, 7457, 25.00, 25.01, 25.1, ...FourteenDayPeriod.volume],
            period: 20
        });
        assert(mfi);
        const mfiOverPeriod = mfi.getMfisOverPeriod();
        assert.isAbove(mfiOverPeriod.length, 0);
        assert.isBelow(mfiOverPeriod.length, 12);
        expect(mfi.getPeriod()).to.equal(20);
        expect(mfi.getAverageMfi()).to.be.greaterThan(40);
    });
});