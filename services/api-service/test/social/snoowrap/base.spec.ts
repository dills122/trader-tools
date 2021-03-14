import { assert } from 'chai';
import * as Base from '../../../lib/social/reddit/snoowrap/base.service';

describe('Social::', function () {
    describe('Snoowrap::', () => {
        describe('Base::', () => {
            beforeEach(() => {
                process.env.REDDIT_USER_AGENT = undefined;
            });
            afterEach(() => {
                delete process.env.REDDIT_USER_AGENT;
            });

            it('Should throw since a env variable is missing', () => {
                const thrws = () => Base.connect();
                assert.throws(thrws);
            });
        });
    });
});