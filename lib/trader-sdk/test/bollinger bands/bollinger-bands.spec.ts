import { describe } from 'mocha';
import { expect } from 'chai';
import _ from 'lodash';
import Sinon from 'sinon';
import { BollingerBands as BB } from '../../lib/bollinger-bands/bollinger-bands';
import config from '../../lib/bollinger-bands/bollinger-bands.config';
const { BollingerBands } = require('technicalindicators');
import { BB as FlatBB } from '../../mocks/BB.mock';

describe('Bollinger Bands::', function () {
  let sandbox: Sinon.SinonSandbox;
  const stubs: any = {};

  beforeEach(() => {
    sandbox = Sinon.createSandbox();
    //Upper test setup
    stubs.BBStub = sandbox.stub(BollingerBands, 'calculate').returns(FlatBB);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Period::', () => {
    it('Should be able to update period', () => {
      const bb = new BB({
        candles: []
      });
      expect(bb.getPeriod()).to.equal(config.period);
      bb.setOrUpdatePeriod(100);
      expect(bb.getPeriod()).to.equal(100);
    });

    it('Should be able to update period, given period', () => {
      const bb = new BB({
        candles: [],
        period: 100
      });
      expect(bb.getPeriod()).to.equal(100);
      bb.setOrUpdatePeriod(config.period);
      expect(bb.getPeriod()).to.equal(config.period);
    });
  });

  describe('StandardDeviation::', () => {
    it('Should be able to update std dev, without a given std dev', () => {
      const bb = new BB({
        candles: []
      });
      expect(bb.getStandardDeviation()).to.equal(config.stdDev);
      bb.setOrUpdateStandardDeviation(100);
      expect(bb.getStandardDeviation()).to.equal(100);
    });

    it('Should be able to update std dev, given std dev', () => {
      const bb = new BB({
        candles: [],
        stdDev: 100
      });
      expect(bb.getStandardDeviation()).to.equal(100);
      bb.setOrUpdateStandardDeviation(config.stdDev);
      expect(bb.getStandardDeviation()).to.equal(config.stdDev);
    });
  });
});
