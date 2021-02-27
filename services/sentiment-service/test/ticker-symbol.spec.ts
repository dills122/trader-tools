import { describe } from 'mocha';
import { expect } from 'chai';
import { isTickerSymbolLike, cleanUpTickerSymbol } from '../lib/ticker-symbols';


describe('TicketSymbol::', function () {
    describe('isTickerSymbolLike::', () => {
        it('Should return a match', () => {
            expect(isTickerSymbolLike('ABR')).to.be.true;
        });
        it('Should return a match', () => {
            expect(isTickerSymbolLike('$ABR')).to.be.true;
        });
        it('Should return a match', () => {
            expect(isTickerSymbolLike('F')).to.be.true;
        });
        it('Should return a match', () => {
            expect(isTickerSymbolLike('MSNVF')).to.be.true;
        });
        it('Should return a false match', () => {
            expect(isTickerSymbolLike('')).to.be.false;
        });
        it('Should return a false match', () => {
            expect(isTickerSymbolLike('ABCDEFGHI')).to.be.false;
        });
        it('Should return a false match', () => {
            expect(isTickerSymbolLike('$')).to.be.false;
        });
    });
    describe('cleanUpTickerSymbol::', () => {
        it('should return a clean symbol', () => {
            const cleanedText = cleanUpTickerSymbol('$abr');
            expect(cleanedText).to.equal('ABR');
        });
        it('should return a clean symbol', () => {
            const cleanedText = cleanUpTickerSymbol('$F');
            expect(cleanedText).to.equal('F');
        });
        it('should return a clean symbol', () => {
            const cleanedText = cleanUpTickerSymbol('$abrD');
            expect(cleanedText).to.equal('ABRD');
        });
        it('should return a clean symbol', () => {
            const cleanedText = cleanUpTickerSymbol('MSNVF');
            expect(cleanedText).to.equal('MSNVF');
        });
        it('should return an empty string given an empty string', () => {
            const cleanedText = cleanUpTickerSymbol('');
            expect(cleanedText).to.equal('');
        });
    });
});