import { describe } from 'mocha';
import { expect, assert } from 'chai';
import Sinon from 'sinon';
import { GenericSentimentAnalysisResult } from '../../lib/sharedTypes';
import { getGenericSentimentResultList } from '../../mocks/generic-sentiment.mock';
import { GeneralRefinerStrategy } from '../../lib/refiners/general'
import _ from 'lodash';

//TODO this will need to be updated after back-testing
describe("Refiners::", function () {
    let sandbox: Sinon.SinonSandbox;
    let spies: any = {};
    let sentimentEntities: GenericSentimentAnalysisResult[] = [];
    describe('General::', () => {
        beforeEach(() => {
            sandbox = Sinon.createSandbox();
            spies.groupBySymbolSpy = sandbox.spy(GeneralRefinerStrategy.prototype, <any>'groupBySymbol');
            spies.aggregateGroupedBySymbolDataSpy = sandbox.spy(GeneralRefinerStrategy.prototype, <any>'aggregateGroupedBySymbolData');
            spies.calculateAggregatedSentimentDataSpy = sandbox.spy(GeneralRefinerStrategy.prototype, <any>'calculateAggregatedSentimentData');
            spies.groupSentimentListByTypeSpy = sandbox.spy(GeneralRefinerStrategy.prototype, <any>'groupSentimentListByType');
            spies.calculateAverageSpy = sandbox.spy(GeneralRefinerStrategy.prototype, <any>'calculateAverage');
        });
        afterEach(() => {
            sandbox.restore();
        });
        describe('Happy Path::', () => {
            beforeEach(() => {
                sentimentEntities = getGenericSentimentResultList(2, 'ABR', 1);
            });
            afterEach(() => {
                sentimentEntities = [];
            });
            it('Should execute happy path', () => {
                const refiner = new GeneralRefinerStrategy({
                    sentimentData: sentimentEntities
                });
                const refinedData = refiner.refine();
                const { negativeSentiment, positiveSentiment, neutralSentiment, sentimentScore } = refinedData[0];
                assert(refinedData);
                expect(refinedData.length).to.equal(1);
                expect(negativeSentiment).to.be.a('number').and.equal(0);
                expect(neutralSentiment).to.be.a('number').and.equal(0);
                expect(positiveSentiment).to.be.a('number').and.equal(1);
                expect(sentimentScore).to.be.a('number');
                assert.isTrue(refinedData.every(data => data.symbol === 'ABR'));
                expect(spies.groupBySymbolSpy.callCount).to.equal(1);
                expect(spies.aggregateGroupedBySymbolDataSpy.callCount).to.equal(1);
                expect(spies.calculateAggregatedSentimentDataSpy.callCount).to.equal(1);
                expect(spies.groupSentimentListByTypeSpy.callCount).to.equal(1);
                expect(spies.calculateAverageSpy.callCount).to.equal(3);
            });
            it('Should execute happy path, two stock symbols', () => {
                sentimentEntities = [...getGenericSentimentResultList(2, 'ABR', 1), ...getGenericSentimentResultList(2, 'F', 1)];
                const refiner = new GeneralRefinerStrategy({
                    sentimentData: sentimentEntities
                });
                const refinedData = refiner.refine();
                assert(refinedData);
                expect(refinedData.length).to.equal(2);
                const ABRData: any = _.find(refinedData, data => data.symbol === 'ABR');
                assert(ABRData);
                const FData: any = _.find(refinedData, data => data.symbol === 'F');
                assert(FData);
                expect(ABRData.negativeSentiment).to.be.a('number').and.equal(0);
                expect(ABRData.neutralSentiment).to.be.a('number').and.equal(0);
                expect(ABRData.positiveSentiment).to.be.a('number').and.equal(1);
                expect(ABRData.sentimentScore).to.be.a('number');
                expect(FData.negativeSentiment).to.be.a('number').and.equal(0);
                expect(FData.neutralSentiment).to.be.a('number').and.equal(0);
                expect(FData.positiveSentiment).to.be.a('number').and.equal(1);
                expect(FData.sentimentScore).to.be.a('number');
                assert.isTrue(refinedData.some(data => data.symbol === 'ABR'));
                assert.isTrue(refinedData.some(data => data.symbol === 'F'));
                expect(spies.groupBySymbolSpy.callCount).to.equal(1);
                expect(spies.aggregateGroupedBySymbolDataSpy.callCount).to.equal(1);
                expect(spies.calculateAggregatedSentimentDataSpy.callCount).to.equal(2);
                expect(spies.groupSentimentListByTypeSpy.callCount).to.equal(2);
                expect(spies.calculateAverageSpy.callCount).to.equal(6);
            });
            it('Should execute happy path, with no data', () => {
                sentimentEntities = [];
                const refiner = new GeneralRefinerStrategy({
                    sentimentData: sentimentEntities
                });
                const refinedData = refiner.refine();
                assert(refinedData);
                expect(refinedData.length).to.equal(0);
            });
        });
    });
});