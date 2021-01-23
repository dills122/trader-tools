import { describe } from 'mocha';
import { expect } from 'chai';
import _ from 'lodash';
import Sinon from 'sinon';
import { BandWidth } from '../../lib/bollingerBands/band-width';
const { BollingerBands } = require('technicalindicators');
import { BandWidthDownward, BB } from '../../mocks/BB.mock';

describe('Bollinger Bands::', function () {
    let sandbox: Sinon.SinonSandbox;
    let stubs: any = {};

    beforeEach(() => {
        sandbox = Sinon.createSandbox();
        //Upper test setup
        stubs.BBStub = sandbox.stub(BollingerBands, 'calculate').returns(BandWidthDownward);
        // stubs.SMAStub = sandbox.stub(SMA, 'calculate').returns([]);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Should have a narrowing band width', () => {
        // stubs.SMAStub.returns([5, 5, 7, 7, 8, 9, 8, 8, 8, 8, 9, 10, 9, 10, 10, 11, 11, 10, 10, 9, 9, 9]);
        const bandWidth = new BandWidth({
            peroidData: []
        });
        expect(bandWidth.hasNarrowingBandwidth()).is.true;
    });

    it('Should NOT have a narrowing band width', () => {
        stubs.BBStub.returns(BB);
        const bandWidth = new BandWidth({
            peroidData: []
        });
        expect(bandWidth.hasNarrowingBandwidth()).is.false;
    });
});