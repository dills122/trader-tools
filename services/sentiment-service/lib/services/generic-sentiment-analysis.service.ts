import _ from 'lodash';
import { analyzerType, GenericSentimentAnalysisResult, SentimentAnalysisFilterFlags, serviceAnalysisType, socialSourceType } from '../sharedTypes';
import { General } from '../refiners';
import { GenericService } from '../reddit/services';
import { AggregatedRefinedSentimentData } from '../refiners/base';

export interface SentimentAnalysisServiceArgs {
    socialSource: socialSourceType,
    analyzer: analyzerType,
    serviceAnalysisType: serviceAnalysisType,
    filterFlags?: SentimentAnalysisFilterFlags,
    subreddit?: string
}

export class GenericSentimentAnalysisService {
    private socialSource: socialSourceType;
    private analyzer: analyzerType;
    private serviceAnalysisType: serviceAnalysisType;
    private subreddit: string;
    private filterFlags: SentimentAnalysisFilterFlags;

    constructor(args: SentimentAnalysisServiceArgs) {
        _.assign(this, args);
        this.analyzeFilterFlags();
    }

    async analyze(): Promise<AggregatedRefinedSentimentData[]> {
        switch (this.socialSource) {
            case 'reddit': {
                const serviceInst = new GenericService.GenericRedditService({
                    analyzer: this.analyzer,
                    filterFlags: this.filterFlags,
                    serviceAnalysisType: this.serviceAnalysisType,
                    subreddit: this.subreddit
                });
                const sentimentData = await serviceInst.service();
                return this.refineSentimentData(sentimentData);
            }
            default:
                throw Error('Unsupported social source provided');
        }
    }

    private analyzeFilterFlags() {
        if (!this.filterFlags) {
            //Default case if nothing is provided
            return this.setFilterFlags({
                discussionMode: true
            });
        }
        const { chaosMode, discussionMode, ddMode } = this.filterFlags;
        if (chaosMode) {
            return this.setFilterFlags({
                ...this.disableAllFilterFlagsOfType(this.filterFlags, 'mode'),
                chaosMode: true,
                matureFilter: false
            });
        }
        if (discussionMode) {
            return this.setFilterFlags({
                ...this.disableAllFilterFlagsOfType(this.filterFlags, 'mode'),
                discussionMode: true
            });
        }
        if (ddMode) {
            return this.setFilterFlags({
                ...this.disableAllFilterFlagsOfType(this.filterFlags, 'mode'),
                ddMode: true
            });
        }
        //Default case if all are false or empty object
        return this.setFilterFlags({
            discussionMode: true
        });
    }

    private setFilterFlags(filterFlags: SentimentAnalysisFilterFlags) {
        this.filterFlags = filterFlags;
    }

    private disableAllFilterFlagsOfType(filterFlags: SentimentAnalysisFilterFlags, type: 'mode' | 'filter') {
        for (const [key] of Object.entries(filterFlags)) {
            const isDesiredType = key.toLowerCase().includes(type);
            if (!isDesiredType) {
                continue;
            }
            filterFlags[key] = false;
        }
        return filterFlags;
    }

    private refineSentimentData(sentimentData: GenericSentimentAnalysisResult[]) {
        const refiner = new General.GeneralRefinerStrategy({
            sentimentData: sentimentData
        });
        return refiner.refine();
    }
}