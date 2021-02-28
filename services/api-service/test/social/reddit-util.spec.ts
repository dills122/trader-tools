import { describe } from 'mocha';
import { expect } from 'chai';
import { trimAndFixUrl } from '../../lib/social/reddit/reddit-util';


describe('Social::', function () {
    describe('Reddit::', () => {
        describe('Util::', () => {
            it('Should fix url that has ending slash', () => {
                const url = 'fake.url/';
                const fixedUrl = trimAndFixUrl(url);
                expect(fixedUrl).to.equal('fake.url.json');
            });
            it('Should fix url that has ending slash', () => {
                const url = 'test.url/';
                const fixedUrl = trimAndFixUrl(url);
                expect(fixedUrl).to.equal('test.url.json');
            });
            it('Should fix url that has ending slash', () => {
                const url = 'test.url/';
                const fixedUrl = trimAndFixUrl(url, 'xml');
                expect(fixedUrl).to.equal('test.url.xml');
            });
            it('Should fix url that does not have ending slash', () => {
                const url = 'fake.url';
                const fixedUrl = trimAndFixUrl(url);
                expect(fixedUrl).to.equal('fake.url.json');
            });
            it('Should fix url that does not have ending slash', () => {
                const url = 'fake.url';
                const fixedUrl = trimAndFixUrl(url, 'xml');
                expect(fixedUrl).to.equal('fake.url.xml');
            });
        });
    });
});