import { assert, expect } from 'chai';
import { Service } from '../../lib/social/reddit/front-page';
import { Post } from '../../lib/social/reddit/shared-types';

const subreddit = 'wallstreetbets';

describe('Integration::', function () {
    describe('Reddit::', () => {
        let FrontPage: Post[];
        it('Should be able to retrieve the front page without issue', async () => {
            try {
                const frontPage = await Service.getFrontPage(subreddit);
                assert(frontPage);
                expect(frontPage.length).greaterThan(0);
                FrontPage = frontPage;
            } catch (err) {
                console.log(err);
                assert(!err);
            }
        });
        it('Should be able retrieve each post and comment thread', async () => {
            try {
                for (let post of FrontPage) {
                    const comments = post.comments;
                    assert(comments);
                    expect(comments.length).greaterThan(0);
                }
            } catch (err) {
                console.log(err);
                assert(!err);
            }
        });
    });
});
