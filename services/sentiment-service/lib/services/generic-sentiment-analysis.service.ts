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
import {
  OverrideTypes,
  initialState as OverrideFiltersInitialState
} from '../reddit/filters/models/override-types';

export interface SentimentAnalysisServiceArgs extends Omit<FlagsAndOptions, 'overrideTypes'> {
  socialSource: socialSourceType;
  analyzer: analyzerType;
  serviceAnalysisType: serviceAnalysisType;
  subreddit?: string;
  overrideTypes?: OverrideTypes;
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
  private overrideTypes: OverrideTypes;

  constructor(args: SentimentAnalysisServiceArgs) {
    _.assign(this, args);
    this.overrideTypes = {
      ...OverrideFiltersInitialState,
      ...(args.overrideTypes || {})
    };
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
          equityWhitelistEnabled: this.equityWhitelistEnabled,
          overrideTypes: this.overrideTypes
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
