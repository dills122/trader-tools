import { describe } from 'mocha';
import { expect } from 'chai';
import _ from 'lodash';
import { FourteenDayPeriodWalksTheLine, FourteenDayPeriod } from '../../mocks/mfi.mock';
import { BPercentMfiIndicator } from '../../lib/indicators'
import { BBHighBPercent, BBSecond } from '../../mocks/BB.mock';
import Sinon from 'sinon';
const { BollingerBands, MFI } = require('technicalindicators');

describe('B% MFI Indicator::', function () {

    let sandbox: Sinon.SinonSandbox;
    let stubs: any = {};

    beforeEach(() => {
        sandbox = Sinon.createSandbox();
        //Upper test setup
        stubs.BBStub = sandbox.stub(BollingerBands, 'calculate').returns(BBHighBPercent);
        stubs.MFIStub = sandbox.stub(MFI, 'calculate').returns([70.06, 78.67, 81.99, 82.55, 82.98, 83.09]);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Should have upward trend, and have over buy signal', () => {
        const bPercentMFiIndicator = new BPercentMfiIndicator.PercentBMFIIndicator({
            closePrices: FourteenDayPeriodWalksTheLine.close,
            highPrices: FourteenDayPeriodWalksTheLine.high,
            lowPrices: FourteenDayPeriodWalksTheLine.low,
            volumeAmounts: FourteenDayPeriodWalksTheLine.volume,
            period: FourteenDayPeriodWalksTheLine.period
        });
        expect(bPercentMFiIndicator.bbWidthClass.isOverBought()).to.be.true;
        expect(bPercentMFiIndicator.bbWidthClass.isOverSold()).to.be.false;
        expect(bPercentMFiIndicator.bbWidthClass.getAveragePercentB()).to.be.greaterThan(.8);
        expect(bPercentMFiIndicator.hasUpwardTrend()).to.be.true;
        expect(bPercentMFiIndicator.hasStrongUpwardTrend()).to.be.true;
        expect(stubs.BBStub.callCount).to.equal(1);
        expect(stubs.MFIStub.callCount).to.equal(1);
    });

    it('Should NOT have an upward trend, or any over buy/sell signals', () => {
        stubs.BBStub.returns(BBSecond);
        stubs.MFIStub.returns([60.06, 62.67, 61.99, 63.55, 62.38, 63.09])
        const bPercentMFiIndicator = new BPercentMfiIndicator.PercentBMFIIndicator({
            closePrices: FourteenDayPeriod.close,
            highPrices: FourteenDayPeriod.high,
            lowPrices: FourteenDayPeriod.low,
            volumeAmounts: FourteenDayPeriod.volume,
            period: FourteenDayPeriod.period
        });
        expect(bPercentMFiIndicator.bbWidthClass.isOverBought()).to.be.false;
        expect(bPercentMFiIndicator.bbWidthClass.isOverSold()).to.be.false;
        expect(bPercentMFiIndicator.bbWidthClass.getAveragePercentB()).to.be.lessThan(.8).and.greaterThan(0);
        expect(bPercentMFiIndicator.hasUpwardTrend()).to.be.false;
        expect(bPercentMFiIndicator.hasStrongUpwardTrend()).to.be.false;
        expect(stubs.BBStub.callCount).to.equal(1);
        expect(stubs.MFIStub.callCount).to.equal(1);
    });
});