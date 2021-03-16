import { describe } from 'mocha';
import { assert, expect } from 'chai';
import { PostFilter } from '../../../lib/reddit/filters/post-filter';
import { Mocks, Socials } from 'api-service';
import _ from 'lodash';

const subreddit = 'wallstreetbets';

describe('Reddit::', () => {
    let mocks: Socials.Reddit.Types.Post[] = [];
    describe('Filters::', () => {
        describe('PostFilter::', () => {
            beforeEach(() => {
                mocks = _.cloneDeep(Mocks.Snoowrap.getPostList(2, subreddit));
                const first = mocks[0];
                const second = mocks[1];
                first.flair = 'discussion';
                second.flair = 'meme';
            });

            it('Should execute happy path for discussionMode', () => {
                const filteredPosts = new PostFilter({
                    posts: mocks,
                    discussionMode: true
                }).filter();
                assert(filteredPosts);
                expect(filteredPosts).to.have.length(1);
                const firstPost = filteredPosts[0];
                assert(firstPost);
                expect(firstPost.flair).to.equal('discussion');
                expect(firstPost.subreddit).to.equal(subreddit);
            });

            // it('Should execute happy path for stickedMode', () => {
            //     mocks = _.cloneDeep(Mocks.Reddit.getLinkList(2, subreddit));
            //     const first = mocks[0];
            //     const second = mocks[1];
            //     first.data.link_flair_text = 'discussion';
            //     first.data.stickied = true;
            //     second.data.link_flair_text = 'meme';
            //     const filteredPosts = new PostFilter({
            //         posts: mocks,
            //         stickedMode: true
            //     }).filter();
            //     assert(filteredPosts);
            //     expect(filteredPosts).to.have.length(1);
            //     const firstPost = filteredPosts[0];
            //     assert(firstPost);
            //     expect(firstPost.data.link_flair_text).to.equal('discussion');
            //     expect(firstPost.data.subreddit).to.equal(subreddit);
            // });

            it('Should execute happy path for nonShitpostingMode', () => {
                const filteredPosts = new PostFilter({
                    posts: mocks,
                    discussionMode: true
                }).filter();
                assert(filteredPosts);
                expect(filteredPosts).to.have.length(1);
                const firstPost = filteredPosts[0];
                assert(firstPost);
                expect(firstPost.flair).to.equal('discussion');
                expect(firstPost.subreddit).to.equal(subreddit);
            });

            it('Should execute default happy path, chaos mode', () => {
                const filteredPosts = new PostFilter({
                    posts: mocks,
                    chaosMode: true
                }).filter();
                assert(filteredPosts);
                expect(filteredPosts).to.have.length(2);
                expect(filteredPosts.some(post => post.flair === 'meme')).to.be.true;
                expect(filteredPosts.some(post => post.flair === 'discussion')).to.be.true;
            });

            it('Should execute happy path when empty set is given', () => {
                const filteredPosts = new PostFilter({
                    posts: []
                }).filter();
                assert(filteredPosts);
                expect(filteredPosts).to.have.length(0);
                const firstPost = filteredPosts[0];
                assert(!firstPost);
            });
        });
    });
});