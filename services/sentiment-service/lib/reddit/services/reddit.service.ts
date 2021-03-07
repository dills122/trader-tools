import _ from 'lodash';
import { analyzerType, GenericSentimentAnalysisResult, SentimentAnalysisFilterFlags, serviceAnalysisType } from "../../sharedTypes";
import { FrontPageService } from './front-page.service';
import {
    GenericCommentTransformer
} from '../../reddit/transformers';
import { CommentListAnalyzerResult } from '../analyzers/comment-list-sentiment-analyzer';

export interface GenericRedditServiceArgs {
    serviceAnalysisType: serviceAnalysisType,
    subreddit?: string, // this is optional because it can run all whitelisted service
    analyzer: analyzerType,
    filterFlags: SentimentAnalysisFilterFlags
};

export class GenericRedditService {
    private serviceAnalysisType: serviceAnalysisType;
    private subreddit: string;
    private analyzer: analyzerType;
    private filterFlags: SentimentAnalysisFilterFlags;

    constructor(args: GenericRedditServiceArgs) {
        _.assign(this, args);

    }

    async service() {
        if (this.serviceAnalysisType === 'front-page') {
            try {
                const serviceInst = new FrontPageService({
                    analyzer: this.analyzer,
                    filterFlags: this.filterFlags,
                    subreddit: this.subreddit
                });
                await serviceInst.service();
                const redditSentimentAnalysisData = serviceInst.getSentimentAnalysisResults();
                return this.mapToGenericSentimentSchema(redditSentimentAnalysisData);
            } catch (err) {
                console.error(err);
                throw err;
            }
        }
        throw Error('Unsupported service type');
    }

    mapToGenericSentimentSchema(commentThreadList: CommentListAnalyzerResult[]) {
        let genericSentimentList: GenericSentimentAnalysisResult[] = [];
        for (let commentThread of commentThreadList) {
            genericSentimentList = genericSentimentList.concat(GenericCommentTransformer.transformList(commentThread));
        }
        return genericSentimentList;
    }
};
