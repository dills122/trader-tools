import { describe } from 'mocha';
import { assert, expect } from 'chai';
import { CommentFilter } from '../../../lib/reddit/filters/comment-filter';
import { Mocks, Socials } from 'api-service';
import _ from 'lodash';

const subreddit = 'wallstreetbets';

describe('Reddit::', () => {
    let mocks: Socials.Reddit.Snoowrap.Types.Comment[] = [];
    describe('Filters::', () => {
        describe('CommentFilter::', () => {
            beforeEach(() => {
                mocks = _.cloneDeep(Mocks.Snoowrap.getCommentList(2, subreddit));
                const first = mocks[0];
                const second = mocks[1];
                first.stickied = true;
                second.body = 'The stock $ABR is really looking good';
            });

            it('Should execute happy path for nonShitpostingMode', () => {
                const second = mocks[1];
                const filteredComments = new CommentFilter({
                    comments: mocks,
                    matureFilter: true
                }).filter();
                assert(filteredComments);
                expect(filteredComments).to.have.length(1);
                const firstPost = filteredComments[0];
                assert(firstPost);
                expect(firstPost.body).to.equal(second.body);
                expect(firstPost.subreddit).to.equal(subreddit);
            });

            it('Should execute happy path for nonShitpostingMode, return empty results', () => {
                const filteredComments = new CommentFilter({
                    comments: [mocks[0]],
                    matureFilter: true
                }).filter();
                assert(filteredComments);
                expect(filteredComments).to.have.length(0);
                const firstPost = filteredComments[0];
                assert(!firstPost);
            });

            it('Should execute happy path for nonShitpostingMode, empty results due to bad language filter', () => {
                mocks = _.cloneDeep(Mocks.Snoowrap.getCommentList(1, subreddit));
                mocks[0].body = 'Fuck $ABR its trash';
                const filteredComments = new CommentFilter({
                    comments: mocks,
                    matureFilter: true
                }).filter();
                assert(filteredComments);
                expect(filteredComments).to.have.length(0);
                const firstPost = filteredComments[0];
                assert(!firstPost);
            });
        });
    });
});