import { GenericSentimentAnalysisResult } from "../../sharedTypes";
import _ from 'lodash';

export interface AggregatedRefinedSentimentData {
    symbol: string,
    conversationEntityCount: number,
    conversationPostiveCount: number,
    conversationNegativeCount: number,
    conversationNeutralCount: number,
    positiveSentiment: number,
    negativeSentiment: number,
    neutralSentiment: number,
    sentimentScore: number
};

export interface BaseRefinerArgs {
    sentimentData: GenericSentimentAnalysisResult[],

};

interface GroupedBySymbol {
    [key: string]: GenericSentimentAnalysisResult[]
};

interface RefinedSentimentDataBySymbol {
    [key: string]: AggregatedRefinedSentimentData[]
};

export class BaseRefiner {
    private sentimentData: GenericSentimentAnalysisResult[];

    constructor(args: BaseRefinerArgs) {

    }

    refine() {

    }

    protected groupBySymbol(): GroupedBySymbol {
        const symbolObjectAgg: GroupedBySymbol = {};
        _.each(this.sentimentData, (sentimentEntity) => {
            const symbol = sentimentEntity.symbol;
            if (symbolObjectAgg.hasOwnProperty(symbol)) {
                symbolObjectAgg[symbol].push(sentimentEntity);
            } else {
                symbolObjectAgg[symbol] = [sentimentEntity];
            }
        });
        return symbolObjectAgg;
    }

    protected aggregateGroupedBySymbolData(groupedEntities: GroupedBySymbol) {
        const symbols = _.keys(groupedEntities);
        for (let symbol of symbols) {
            const sentimentList = groupedEntities[symbol];
            //TODO create a way to build and calculate as we go the values of each symbol in the agg obj
        }
    }
};
