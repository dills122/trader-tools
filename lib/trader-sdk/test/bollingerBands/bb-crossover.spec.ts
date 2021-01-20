import { describe } from 'mocha';
import { expect } from 'chai';
import _ from 'lodash';
import Sinon from 'sinon';
import { CrossOver } from '../../lib/bollingerBands/bb-crossover';
const { BollingerBands, SMA } = require('technicalindicators');
import { BB } from '../../mocks/BB.mock';

describe('Bollinger Bands::', function () {
    let sandbox: Sinon.SinonSandbox;
    let stubs: any = {};

    beforeEach(() => {
        sandbox = Sinon.createSandbox();
        //Upper test setup
        stubs.BBStub = sandbox.stub(BollingerBands, 'calculate').returns(BB);
        stubs.SMAStub = sandbox.stub(SMA, 'calculate').returns([]);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Should run happy path and have upward trend (Upper bound cross over)', () => {
        stubs.SMAStub.returns([5, 5, 7, 7, 8, 9, 8, 8, 8, 8, 9, 10, 9, 10, 10, 11, 11, 10, 10, 9, 9, 9]);
        const BBTrend = CrossOver({
            dataPoints: []
        });
        expect(BBTrend).to.equal('upwards');
    });

    it('Should run happy path and have downward trend (Lower bound cross over)', () => {
        stubs.SMAStub.returns([5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 3, 3, 3, 1, 3, 1, 1, 3, 3, 3, 4, 3]);
        const BBTrend = CrossOver({
            dataPoints: []
        });
        expect(BBTrend).to.equal('downwards');
    });

    it('Should run happy path and have no trend', () => {
        stubs.BBStub.returns([]);
        stubs.SMAStub.returns([]);
        const BBTrend = CrossOver({
            dataPoints: []
        });
        expect(BBTrend).to.be.undefined;
    });
});