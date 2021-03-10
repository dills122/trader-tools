import { describe } from 'mocha';
import { expect, assert } from 'chai';
import { analyze } from '../lib/analyze-sentiment';
import { standardizeInput } from '../lib/standardize-input';
import { SentimentConfig } from '../lib/sentiment.config';


describe('AnalyzeSentiment::', function () {
    it('Should analyze input and find positive sentiment', () => {
        const input = 'This $ABR is a great stock';
        const standardizedInput = standardizeInput(input);
        expect(standardizedInput).to.have.length(3);
        expect(standardizedInput).to.contain('great');
        expect(standardizedInput).to.contain('stock');

        const sentimentResults = analyze(standardizedInput);
        expect(sentimentResults.status).to.equal('very-positive');
        expect(sentimentResults.score).to.greaterThan(SentimentConfig.positive);
    });

    it('Should analyze input and find positive sentiment', () => {
        const input = 'This $ABR is a good stock';
        const standardizedInput = standardizeInput(input);
        expect(standardizedInput).to.have.length(3);
        expect(standardizedInput).to.contain('good');
        expect(standardizedInput).to.contain('stock');

        const sentimentResults = analyze(standardizedInput);
        expect(sentimentResults.status).to.equal('very-positive');
        expect(sentimentResults.score).to.greaterThan(SentimentConfig.positive);
    });

    it('Should analyze input and find positive sentiment', () => {
        const input = 'This $ABR is a fucking great stock';
        const standardizedInput = standardizeInput(input);
        expect(standardizedInput).to.have.length(3);
        expect(standardizedInput).to.contain('great');
        expect(standardizedInput).to.contain('stock');

        const sentimentResults = analyze(standardizedInput);
        expect(sentimentResults.status).to.equal('very-positive');
        expect(sentimentResults.score).to.greaterThan(SentimentConfig.positive);
    });

    it('Should analyze input and find negative sentiment', () => {
        const input = 'This $ABR is not a great stock and you should not buy it';
        const standardizedInput = standardizeInput(input);
        expect(standardizedInput.length).to.be.greaterThan(3)
        expect(standardizedInput).to.contain('great');
        expect(standardizedInput).to.contain('stock');

        const sentimentResults = analyze(standardizedInput);
        expect(sentimentResults.status).to.equal('very-negative');
        expect(sentimentResults.score).to.lessThan(SentimentConfig.positive);
        assert.isAtLeast(sentimentResults.score, SentimentConfig.veryNegative);
    });
});