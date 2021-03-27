import _ from 'lodash';
import {
  AnalyzerOptions,
  analyzerType,
  FlagsAndOptions,
  GenericSentimentAnalysisResult,
  SentimentAnalysisFilterFlags,
  serviceAnalysisType
} from '../../shared-types';
import { FrontPageService } from './front-page.service';
import { GenericCommentTransformer } from '../../reddit/transformers';
import { CommentListAnalyzerResult } from '../analyzers/comment-list-sentiment-analyzer';

export interface GenericRedditServiceArgs extends FlagsAndOptions {
  serviceAnalysisType: serviceAnalysisType;
  subreddit?: string; // this is optional because it can run all whitelisted service
  analyzer: analyzerType;
}

export class GenericRedditService {
  private serviceAnalysisType: serviceAnalysisType;
  private subreddit: string;
  private analyzer: analyzerType;
  private filterFlags: SentimentAnalysisFilterFlags;
  private analyzerOptions: AnalyzerOptions;
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
