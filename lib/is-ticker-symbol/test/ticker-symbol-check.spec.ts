import { expect } from 'chai';
import { assert } from 'console';
import * as Lib from '../index';

const goodSymbols = ['TSLA', 'AAPL', 'MSFT', 'ABR'];
const badSymbols = ['Cupertino', 'information', 'Company'];

describe('Lib', function () {
    this.timeout(6000);
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

    describe('isCompanyName::', () => {
        it('Should find match', () => {
            let isCompanyName = Lib.isCompanyName('Ford Motor Company');
            expect(isCompanyName.isMatch).to.be.true;
            expect(isCompanyName.name).and.equals('Ford Motor Company');
            isCompanyName = Lib.isCompanyName('Ford Motor Company', .2);
            expect(isCompanyName.isMatch).to.be.true;
            expect(isCompanyName.name).and.equals('Ford Motor Company');
        });
        it('Should not find match', () => {
            let isCompanyName = Lib.isCompanyName('akfsklasklfks');
            expect(isCompanyName.isMatch).to.be.false;
            expect(isCompanyName.name).to.be.empty;
            isCompanyName = Lib.isCompanyName('akfsklasklfks', .2);
            expect(isCompanyName.isMatch).to.be.false;
            expect(isCompanyName.name).to.be.empty;
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