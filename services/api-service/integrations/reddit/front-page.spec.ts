import { assert, expect } from 'chai';
import { isRedditLinkSchema, isRedditLinkSchemaList, RedditRawResult } from '../../lib/social/reddit/reddit-types';
import { getFrontPageOfSubreddit, getPostAndCommentThread } from '../../lib/social/reddit/reddit.service';

const subreddit = 'wallstreetbets';

describe('Integration::', function () {
    describe('Reddit::', () => {
        let FrontPage: RedditRawResult;
        it('Should be able to retrieve the front page without issue', async () => {
            try {
                const frontPage = await getFrontPageOfSubreddit(subreddit);
                assert(frontPage);
                assert(frontPage.data.children);
                expect(frontPage.data.children.length).greaterThan(0);
                FrontPage = frontPage;
            } catch (err) {
                console.log(err);
                assert(!err);
            }
        });
        it('Should be able retrieve each post and comment thread', async () => {
            try {
                const posts = FrontPage.data.children;
                assert.isTrue(isRedditLinkSchemaList(posts));
                for (let post of posts) {
                    if (!isRedditLinkSchema(post)) {
                        console.error(post);
                        throw Error('Invalid Type, expected Reddit Link List');
                    }
                    const postAndThread = await getPostAndCommentThread(post.data.url);
                    assert(postAndThread);
                    console.log(postAndThread);
                }
            } catch (err) {
                console.log(err);
                assert(!err);
            }
        });
    });
});
