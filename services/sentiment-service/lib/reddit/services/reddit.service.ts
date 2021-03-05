import _ from 'lodash';
import { analyzerType, SentimentAnalysisFilterFlags, serviceAnalysisType } from "../../sharedTypes";
import { FrontPageService } from './front-page.service';

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
                return await serviceInst.service();
            } catch (err) {
                console.log(err);
                throw err;
            }
        }
        throw Error('Unsupported service type');
    }
};
