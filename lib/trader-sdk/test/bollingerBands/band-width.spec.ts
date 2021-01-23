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
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("hasNarrowingBandwidth::", () => {
        it('Should have a narrowing band width', () => {
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

    describe("isOverBought::", () => {
        it('Should signal over bought', () => {
            const bandWidth = new BandWidth({
                peroidData: [6, 6, 7, 6, 7, 7, 9, 8, 8, 9, 10, 11, 11, 12, 10, 10, 11, 12, 10, 11, 11, 11]
            });
            expect(bandWidth.isOverBought()).is.true;
        });

        it('Should NOT signal over bought', () => {
            stubs.BBStub.returns(BB);
            const bandWidth = new BandWidth({
                peroidData: [6, 6, 7, 6, 7, 7, 9, 8, 8, 9, 7, 8, 8, 9, 7, 7, 8, 9, 7, 8, 8, 8]
            });
            expect(bandWidth.isOverBought()).is.false;
        });
    });

    describe("isOverSold::", () => {
        it('Should signal over sold', () => {
            const bandWidth = new BandWidth({
                peroidData: [3, 3, 4, 3, 4, 5, 3, 3, 4, 2, 2, 1, 1, 3, 3, 3, 4, 2, 2, 1, 2, 4]
            });
            expect(bandWidth.isOverSold()).is.true;
        });

        it('Should NOT signal over sold', () => {
            stubs.BBStub.returns(BB);
            const bandWidth = new BandWidth({
                peroidData: [3, 3, 4, 3, 4, 5, 3, 3, 4, 4, 4, 3, 3, 3, 3, 3, 4, 4, 4, 3, 4, 4]
            });
            expect(bandWidth.isOverSold()).is.false;
        });
    });
});