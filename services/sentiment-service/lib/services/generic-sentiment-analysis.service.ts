import _ from 'lodash';
import {
  AggregatedRefinedSentimentData,
  AnalyzerOptions,
  analyzerType,
  FlagsAndOptions,
  GenericSentimentAnalysisResult,
  serviceAnalysisType,
  socialSourceType
} from '../shared-types';
import { General } from '../refiners';
import { GenericService } from '../reddit/services';
import { FilterType } from '../reddit/filters';

export interface SentimentAnalysisServiceArgs extends FlagsAndOptions {
  socialSource: socialSourceType;
  analyzer: analyzerType;
  serviceAnalysisType: serviceAnalysisType;
  subreddit?: string;
}

export class GenericSentimentAnalysisService {
  private socialSource: socialSourceType;
  private analyzer: analyzerType;
  private serviceAnalysisType: serviceAnalysisType;
  private subreddit: string;
  private filterType: FilterType;
  private analyzerOptions: AnalyzerOptions;
  private whitelist: string[] = [];
  private equityWhitelistEnabled: boolean;

  constructor(args: SentimentAnalysisServiceArgs) {
    _.assign(this, args);
  }

  async analyze(): Promise<AggregatedRefinedSentimentData[]> {
    switch (this.socialSource) {
      case 'reddit': {
        console.log('Executing Reddit Generic Service', {
          analyzer: this.analyzer,
          filterType: this.filterType,
          serviceAnalysisType: this.serviceAnalysisType,
          subreddit: this.subreddit,
          analyzerOptions: this.analyzerOptions,
          whitelist: this.whitelist
        });
        const serviceInst = new GenericService.GenericRedditService({
          analyzer: this.analyzer,
          filterType: this.filterType,
          serviceAnalysisType: this.serviceAnalysisType,
          subreddit: this.subreddit,
          analyzerOptions: this.analyzerOptions,
          equityWhitelist: this.whitelist,
          equityWhitelistEnabled: this.equityWhitelistEnabled
        });
        const sentimentData = await serviceInst.service();
        console.log('Finished Executing Reddit Service');
        return this.refineSentimentData(sentimentData);
      }
      default:
        throw Error('Unsupported social source provided');
    }
  }

  private refineSentimentData(sentimentData: GenericSentimentAnalysisResult[]) {
    const refiner = new General.GeneralRefinerStrategy({
      sentimentData: sentimentData
    });
    return refiner.refine();
  }
}
