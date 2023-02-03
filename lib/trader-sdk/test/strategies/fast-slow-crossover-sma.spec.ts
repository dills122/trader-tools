import { describe } from 'mocha';
import { expect } from 'chai';
import Sinon from 'sinon';
import * as Indicator from '../../lib/strategies/fast-slow-crossover-sma';
import SMA from '../../lib/sma';
import { buildUniformCandlesFromArray, generateArrayOfNumbers } from '../../test-utils';
import { IndicatorLib } from '../../lib/indicator-lib.type';

describe('Fast/Slow Crossover SMA::', function () {
  let sandbox: Sinon.SinonSandbox;
  const stubs: any = {};

  beforeEach(() => {
    sandbox = Sinon.createSandbox();
    stubs.sma_calculate_TechnicalIndicators = sandbox
      .stub(SMA.prototype, <any>'calculate_TechnicalIndicators')
      .onCall(0)
      .returns([20]) //Fast
      .onCall(1)
      .returns([19.75])
      .onCall(2)
      .returns([20]) //Fast
      .onCall(3)
      .returns([19.5])
      .onCall(4)
      .returns([21]); //Slow
    stubs.sma_calculate_TradingSignals = sandbox
      .stub(SMA.prototype, <any>'calculate_TradingSignals')
      .onCall(0)
      .returns([20]) //Fast
      .onCall(1)
      .returns([19.75])
      .onCall(2)
      .returns([20]) //Fast
      .onCall(3)
      .returns([19.5])
      .onCall(4)
      .returns([21]); //Slow
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Should run happy path have upward trend on slow SMA', () => {
    const indicator = new Indicator.default({
      candles: buildUniformCandlesFromArray(generateArrayOfNumbers(200, 20, 0.5))
    });
    expect(indicator.hasRecentCrossUp()).to.be.true;
    expect(indicator.hasCrossUp()).to.be.true;
    expect(indicator.hasRecentCrossDown()).to.be.false;
    expect(indicator.hasCrossDown()).to.be.false;
  });

  it('Should run happy path and have all calculation methods output the same', () => {
    const ind_TechnicalIndicators = new Indicator.default({
      candles: buildUniformCandlesFromArray(generateArrayOfNumbers(200, 20, 0.5)),
      lib: IndicatorLib.TechnicalIndicators
    });

    const ind_TradingSignals = new Indicator.default({
      candles: buildUniformCandlesFromArray(generateArrayOfNumbers(200, 20, 0.5)),
      lib: IndicatorLib.TradingSignals
    });

    expect(ind_TradingSignals.hasRecentCrossUp()).to.equal(ind_TechnicalIndicators.hasRecentCrossUp());
    expect(ind_TradingSignals.hasCrossUp()).to.equal(ind_TechnicalIndicators.hasCrossUp());
    expect(ind_TradingSignals.hasRecentCrossDown()).to.equal(ind_TechnicalIndicators.hasRecentCrossDown());
    expect(ind_TradingSignals.hasCrossDown()).to.equal(ind_TechnicalIndicators.hasCrossDown());
  });

  it('Should run happy path and have downward trend on slow SMA', () => {
    stubs.sma_calculate_TechnicalIndicators
      .onCall(0)
      .returns([20]) //Fast
      .onCall(1)
      .returns([19.75])
      .onCall(2)
      .returns([20]) //Fast
      .onCall(3)
      .returns([19.5])
      .onCall(4)
      .returns([19.2]); //Slow
    stubs.sma_calculate_TradingSignals
      .onCall(0)
      .returns([20]) //Fast
      .onCall(1)
      .returns([19.75])
      .onCall(2)
      .returns([20]) //Fast
      .onCall(3)
      .returns([19.5])
      .onCall(4)
      .returns([19.2]); //Slow
    const indicator = new Indicator.default({
      candles: buildUniformCandlesFromArray(generateArrayOfNumbers(200, 20, 0.5))
    });
    expect(indicator.hasRecentCrossUp()).to.be.false;
    expect(indicator.hasCrossUp()).to.be.false;
    expect(indicator.hasRecentCrossDown()).to.be.true;
    expect(indicator.hasCrossDown()).to.be.true;
  });

  it('Should run happy path and have a flat trend', () => {
    stubs.sma_calculate_TechnicalIndicators
      .onCall(0)
      .returns([20]) //Fast
      .onCall(1)
      .returns([19.75])
      .onCall(2)
      .returns([20]) //Fast
      .onCall(3)
      .returns([19.5])
      .onCall(4)
      .returns([19.5]); //Slow
    stubs.sma_calculate_TradingSignals
      .onCall(0)
      .returns([20]) //Fast
      .onCall(1)
      .returns([19.75])
      .onCall(2)
      .returns([20]) //Fast
      .onCall(3)
      .returns([19.5])
      .onCall(4)
      .returns([19.5]); //Slow
    const indicator = new Indicator.default({
      candles: buildUniformCandlesFromArray(generateArrayOfNumbers(200, 20))
    });
    expect(indicator.hasRecentCrossUp()).to.be.false;
    expect(indicator.hasCrossUp()).to.be.false;
    expect(indicator.hasRecentCrossDown()).to.be.false;
    expect(indicator.hasCrossDown()).to.be.true;
  });
});
