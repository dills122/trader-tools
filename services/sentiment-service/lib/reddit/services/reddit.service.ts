import _ from 'lodash';
import {
  analyzerType,
  GenericSentimentAnalysisResult,
  SentimentAnalysisFilterFlags,
  serviceAnalysisType
} from '../../sharedTypes';
import { FrontPageService } from './front-page.service';
import { GenericCommentTransformer } from '../../reddit/transformers';
import { CommentListAnalyzerResult } from '../analyzers/comment-list-sentiment-analyzer';
import { CommentAnalyzer } from '../analyzers';

export interface GenericRedditServiceArgs {
  serviceAnalysisType: serviceAnalysisType;
  subreddit?: string; // this is optional because it can run all whitelisted service
  analyzer: analyzerType;
  filterFlags: SentimentAnalysisFilterFlags;
  analyzerOptions?: CommentAnalyzer.CommentListAnalyzerOptions;
  whitelist?: string[];
}

export class GenericRedditService {
  private serviceAnalysisType: serviceAnalysisType;
  private subreddit: string;
  private analyzer: analyzerType;
  private filterFlags: SentimentAnalysisFilterFlags;
  private analyzerOptions: CommentAnalyzer.CommentListAnalyzerOptions;
  private whitelist: string[] = [];

  constructor(args: GenericRedditServiceArgs) {
    _.assign(this, args);
  }

  async service(): Promise<GenericSentimentAnalysisResult[]> {
    if (this.serviceAnalysisType === 'front-page') {
      try {
        const serviceInst = new FrontPageService({
          analyzer: this.analyzer,
          filterFlags: this.filterFlags,
          subreddit: this.subreddit,
          analyzerOptions: this.analyzerOptions,
          whitelist: this.whitelist
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

  mapToGenericSentimentSchema(
    commentThreadList: CommentListAnalyzerResult[]
  ): GenericSentimentAnalysisResult[] {
    let genericSentimentList: GenericSentimentAnalysisResult[] = [];
    for (const commentThread of commentThreadList) {
      genericSentimentList = genericSentimentList.concat(
        GenericCommentTransformer.transformList(commentThread)
      );
    }
    return genericSentimentList;
  }
}
