import { describe } from 'mocha';
import { expect } from 'chai';
import _ from 'lodash';
import Sinon from 'sinon';
import { BollingerBands as BB } from '../../lib/bollingerBands/bollinger-bands';
import config from '../../lib/bollingerBands/bollinger-bands.config';
const { BollingerBands } = require('technicalindicators');
import { BB as FlatBB } from '../../mocks/BB.mock';

describe('Bollinger Bands::', function () {
    let sandbox: Sinon.SinonSandbox;
    let stubs: any = {};

    beforeEach(() => {
        sandbox = Sinon.createSandbox();
        //Upper test setup
        stubs.BBStub = sandbox.stub(BollingerBands, 'calculate').returns(FlatBB);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("Peroid::", () => {
        it('Should be able to update peroid', () => {
            const bb = new BB({
                peroidData: []
            });
            expect(bb.getPeroid()).to.equal(config.peroid);
            bb.setOrUpdatePeroid(100);
            expect(bb.getPeroid()).to.equal(100);
        });

        it('Should be able to update peroid, given peroid', () => {
            const bb = new BB({
                peroidData: [],
                peroid: 100
            });
            expect(bb.getPeroid()).to.equal(100);
            bb.setOrUpdatePeroid(config.peroid);
            expect(bb.getPeroid()).to.equal(config.peroid);
        });
    });

    describe("StandardDeviation::", () => {
        it('Should be able to update std dev, without a given std dev', () => {
            const bb = new BB({
                peroidData: []
            });
            expect(bb.getStandardDeviation()).to.equal(config.stdDev);
            bb.setOrUpdateStandardDeviation(100);
            expect(bb.getStandardDeviation()).to.equal(100);
        });

        it('Should be able to update std dev, given std dev', () => {
            const bb = new BB({
                peroidData: [],
                stdDev: 100
            });
            expect(bb.getStandardDeviation()).to.equal(100);
            bb.setOrUpdateStandardDeviation(config.stdDev);
            expect(bb.getStandardDeviation()).to.equal(config.stdDev);
        });
    });
});