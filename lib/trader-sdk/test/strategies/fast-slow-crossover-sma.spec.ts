import { describe } from 'mocha';
import { expect } from 'chai';
import _ from 'lodash';
import Sinon from 'sinon';
import * as Indicator from '../../lib/strategies/fast-slow-crossover-sma';
const { SMA } = require('technicalindicators');
import { buildUniformCandlesFromArray, generateArrayOfNumbers } from '../../test-utils';

describe('Fast/Slow Crossover SMA::', function () {
    let sandbox: Sinon.SinonSandbox;
    let stubs: any = {};

    beforeEach(() => {
        sandbox = Sinon.createSandbox();
        //Upper test setup
        stubs.SMAStub = sandbox.stub(SMA, 'calculate')
            .onCall(0).returns([20]) //Fast
            .onCall(1).returns([19.75])
            .onCall(2).returns([20]) //Fast
            .onCall(3).returns([19.5])
            .onCall(4).returns([21]) //Slow
            ;
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Should run happy path have upward trend on slow SMA', () => {
        const indicator = new Indicator.default({
            candles: buildUniformCandlesFromArray(generateArrayOfNumbers(200, 20, .5))
        });
        expect(indicator.hasRecentCrossUp()).to.be.true;
        expect(indicator.hasRecentCrossDown()).to.be.false;
    });

    it('Should run happy path and have downward trend on slow SMA', () => {
        stubs.SMAStub
        .onCall(0).returns([20]) //Fast
        .onCall(1).returns([19.75])
        .onCall(2).returns([20]) //Fast
        .onCall(3).returns([19.5])
        .onCall(4).returns([19.2]) //Slow
        ;
        const indicator = new Indicator.default({
            candles: buildUniformCandlesFromArray(generateArrayOfNumbers(200, 20, .5))
        });
        expect(indicator.hasRecentCrossUp()).to.be.false;
        expect(indicator.hasRecentCrossDown()).to.be.true;
    });

    it('Should run happy path and have a flat trend', () => {
        stubs.SMAStub
        .onCall(0).returns([20]) //Fast
        .onCall(1).returns([19.75])
        .onCall(2).returns([20]) //Fast
        .onCall(3).returns([19.5])
        .onCall(4).returns([19.5]) //Slow
        ;
        const indicator = new Indicator.default({
            candles: buildUniformCandlesFromArray(generateArrayOfNumbers(200, 20, .5))
        });
        expect(indicator.hasRecentCrossUp()).to.be.false;
        expect(indicator.hasRecentCrossDown()).to.be.false;
    });
});