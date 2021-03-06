import { expect } from 'chai';
import { assert } from 'console';
import * as Lib from '../index';

const goodSymbols = ['TSLA', 'AAPL', 'MSFT'];
const badSymbols = ['Cupertino', 'information', 'Company'];

describe('Lib', function () {
    describe('isTickerSymbol::', () => {
        it('Should find match', () => {
            for (let symbol of goodSymbols) {
                const isTickerSymbol = Lib.isTickerSymbol(symbol);
                expect(isTickerSymbol).is.true;
            }
        });
        it('Should not a find match', () => {
            for (let symbol of badSymbols) {
                const isTickerSymbol = Lib.isTickerSymbol(symbol);
                expect(isTickerSymbol).is.false;
            }
        });
    });

    describe('getTickerSymbols::', () => {
        it('Should be able to get the list of symbols', () => {
            const symbols = Lib.getTickerSymbols();
            assert(symbols);
            expect(symbols).to.have.length.greaterThan(1);
        });
    });
    describe('getTickerSymbolDetailList::', () => {
        it('Should be able to get the list of symbols', () => {
            const symbols = Lib.getTickerSymbolDetailList();
            assert(symbols);
            expect(symbols).to.have.length.greaterThan(1);
        });
    });
});