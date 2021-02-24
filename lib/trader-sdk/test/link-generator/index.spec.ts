import { describe } from 'mocha';
import { expect, assert } from 'chai';
import _ from 'lodash';
import { LinkTemplates, generator, generateLinkList } from '../../lib/link-generator';

const numOfLinkTemplates = _.keys(LinkTemplates).length;

describe('Link-Generator::', () => {

    it('Should generate a single link', () => {
        const link = generator(LinkTemplates.Zacks, 'ABR');
        expect(link).to.equal('https://www.zacks.com/stock/quote/ABR');
    });

    it('Should generate a single link', () => {
        const link = generator(LinkTemplates.TradingView, 'NYSE-ABR');
        expect(link).to.equal('https://in.tradingview.com/symbols/NYSE-ABR');
    });

    it('Should generate a list of all the links', () => {
        const links: any = generateLinkList();
        const firstLinkObject = links[0];
        assert(firstLinkObject);
        assert(firstLinkObject.symbol);
        expect(firstLinkObject.TradingView).to.contain('-');
        expect(_.keys(firstLinkObject).length).to.equal(numOfLinkTemplates + 1);
    });
});