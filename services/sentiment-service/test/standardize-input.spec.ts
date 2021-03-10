import { describe } from 'mocha';
import { expect } from 'chai';
import { standardizeInput, extractStockOrCryptoTicker } from '../lib/standardize-input';


describe('StandardizeInput::', function () {
    describe('standardizeInput::', () => {

        it('Should filter input', () => {
            const input = 'This $ABR is a great stock';
            const standardizedInput = standardizeInput(input);
            expect(standardizedInput).to.have.length(3);
            expect(standardizedInput).to.contain('great');
            expect(standardizedInput).to.contain('stock');
        });

        it('Should filter input', () => {
            const input = 'This $F is a bad stock';
            const standardizedInput = standardizeInput(input);
            expect(standardizedInput).to.have.length(3);
            expect(standardizedInput).to.contain('bad');
            expect(standardizedInput).to.contain('stock');
        });

        it('Should filter input', () => {
            const input = 'This stock isn\'t that great';
            const standardizedInput = standardizeInput(input);
            expect(standardizedInput).to.have.length(3);
            expect(standardizedInput).to.contain('great');
            expect(standardizedInput).to.contain('stock');
        });
    });

    describe('extractStockOrCryptoTicker::', () => {
        it('Should be able to extract stock ticker', () => {
            const input = 'This $ABR is a great stock';
            const stockTickers = extractStockOrCryptoTicker(input);
            expect(stockTickers).to.have.length(1);
            expect(stockTickers[0]).to.equal('ABR');
        });
        it('Should be able to extract stock ticker', () => {
            const input = 'This $F is a great stock';
            const stockTickers = extractStockOrCryptoTicker(input);
            expect(stockTickers).to.have.length(1);
            expect(stockTickers[0]).to.equal('F');
        });
        // it('Should be able to extract stock ticker', () => {
        //     const input = 'This $MSNVF is a great stock';
        //     const stockTickers = extractStockOrCryptoTicker(input);
        //     expect(stockTickers).to.have.length(1);
        //     expect(stockTickers[0]).to.equal('MSNVF');
        // });
        it('Should be able to extract stock ticker', () => {
            const input = 'This ABR is a great stock';
            const stockTickers = extractStockOrCryptoTicker(input);
            expect(stockTickers).to.have.length(1);
            expect(stockTickers[0]).to.equal('ABR');
        });
        it('Should be able to extract stock ticker', () => {
            const input = 'This F is a great stock';
            const stockTickers = extractStockOrCryptoTicker(input);
            expect(stockTickers).to.have.length(1);
            expect(stockTickers[0]).to.equal('F');
        });
        // it('Should be able to extract stock ticker', () => {
        //     const input = 'This MSNVF is a great stock';
        //     const stockTickers = extractStockOrCryptoTicker(input);
        //     expect(stockTickers).to.have.length(1);
        //     expect(stockTickers[0]).to.equal('MSNVF');
        // });

        it('Should fail to be able to extract stock ticker', () => {
            const input = 'This is a great stock';
            const stockTickers = extractStockOrCryptoTicker(input);
            expect(stockTickers).to.have.length(0);
        });
    });
});