import { describe } from 'mocha';
import { assert, expect } from 'chai';
import { CommentListSentimentAnalyzer } from '../../../lib/reddit/analyzers/comment-list-sentiment-analyzer';
import { Mocks, Socials } from 'api-service';
import _ from 'lodash';

const subreddit = 'wallstreetbets';

describe('Reddit::', () => {
    let mocks: Socials.Reddit.Types.RedditCommentSchemaExtended[] = [];
    describe('Analyzer::', () => {
        describe('CommentList::', () => {
            beforeEach(() => {
                mocks = _.cloneDeep(Mocks.Reddit.getExtendedCommentList(2, subreddit, 'ABR'));
                const first = mocks[0];
                const second = mocks[1];
                first.data.stickied = true;
                second.data.body = 'The stock $ABR is really looking good';
            });

            it('Should analyze only the comments with a ticker symbol in it', () => {
                const analyzer = new CommentListSentimentAnalyzer({
                    comments: mocks,
                    subreddit: subreddit,
                    title: 'This is a title'
                });
                const results = analyzer.analyze();
                assert(analyzer);
                assert(results);
                expect(results.title).to.equal('This is a title');
                expect(results.subreddit).to.equal(subreddit);
                expect(results.positiveComments).to.have.length(1);
                expect(results.negativeComments).to.have.length(0);
                const postiveComment = results.positiveComments[0];
                assert(postiveComment);
                expect(postiveComment.tickerSymbol).to.equal('ABR');
                assert(postiveComment.comment);
            });

            it('Should analyze only the comments with a ticker symbol in it, negative sentiment', () => {
                const negativeCommentMock = _.cloneDeep(Mocks.Reddit.getExtendedCommentList(1, subreddit))[0];
                negativeCommentMock.data.body = '$F is a pretty bad stock. I would sell it';
                negativeCommentMock.tickerSymbol = 'F';
                negativeCommentMock.data.ups = 1000;
                mocks.push(negativeCommentMock);
                const analyzer = new CommentListSentimentAnalyzer({
                    comments: mocks,
                    subreddit: subreddit,
                    title: 'This is a title'
                });
                const results = analyzer.analyze();
                assert(analyzer);
                assert(results);
                expect(results.title).to.equal('This is a title');
                expect(results.subreddit).to.equal(subreddit);
                expect(results.positiveComments).to.have.length(1);
                expect(results.negativeComments).to.have.length(1);
                const postiveComment = results.positiveComments[0];
                assert(postiveComment);
                expect(postiveComment.tickerSymbol).to.equal('ABR');
                assert(postiveComment.comment);
                const negativeComment = results.negativeComments[0];
                assert(negativeComment);
                expect(negativeComment.tickerSymbol).to.equal('F');
                assert(negativeComment.comment);
            });

            it('Should still return results when given no comments to analyze', () => {
                mocks = [];
                const analyzer = new CommentListSentimentAnalyzer({
                    comments: mocks,
                    subreddit: subreddit,
                    title: 'This is a title'
                });
                const results = analyzer.analyze();
                assert(analyzer);
                assert(results);
                expect(results.title).to.equal('This is a title');
                expect(results.subreddit).to.equal(subreddit);
                expect(results.positiveComments).to.have.length(0);
                expect(results.negativeComments).to.have.length(0);
            });
        });
    });
});