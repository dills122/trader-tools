import { GenericSentimentAnalysisResult } from "../sharedTypes";
import { SentimentConfig } from '../sentiment.config';
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

export class BaseRefiner {
    private sentimentData: GenericSentimentAnalysisResult[];
    private aggergatedSentimentData: AggregatedRefinedSentimentData[] = [];

    constructor(args: BaseRefinerArgs) {
        _.assign(this, args);
    }

    refine() {
        const grouped = this.groupBySymbol();
        return this.aggregateGroupedBySymbolData(grouped);
    }

    protected groupBySymbol(): GroupedBySymbol {
        const symbolObjectAgg: GroupedBySymbol = {};
        for (let sentimentEntity of this.sentimentData) {
            const symbol = sentimentEntity.symbol;
            if (symbolObjectAgg.hasOwnProperty(symbol)) {
                symbolObjectAgg[symbol].push(sentimentEntity);
            } else {
                symbolObjectAgg[symbol] = [sentimentEntity];
            }
        }
        return symbolObjectAgg;
    }

    protected aggregateGroupedBySymbolData(groupedEntities: GroupedBySymbol) {
        const symbols = _.keys(groupedEntities);
        for (let symbol of symbols) {
            const sentimentEntities = groupedEntities[symbol];
            const aggergatedSentimentData = this.calculateAggergatedSentimentData(sentimentEntities, symbol);
            this.aggergatedSentimentData.push(aggergatedSentimentData);
        }
        return this.aggergatedSentimentData;
    }

    private calculateAggergatedSentimentData(sentimentEntities: GenericSentimentAnalysisResult[], symbol: string): AggregatedRefinedSentimentData {
        const groupedEntitiesBySentimentType = this.groupSentimentListByType(sentimentEntities);
        const conversationPostiveCount = groupedEntitiesBySentimentType.positiveEntities.length;
        const conversationNegativeCount = groupedEntitiesBySentimentType.negativeEntities.length;
        const conversationNeutralCount = groupedEntitiesBySentimentType.neutralEntities.length;
        const positiveSentiment = this.calculateAverage(groupedEntitiesBySentimentType.positiveEntities);
        const negativeSentiment = this.calculateAverage(groupedEntitiesBySentimentType.negativeEntities);
        const neutralSentiment = this.calculateAverage(groupedEntitiesBySentimentType.neutralEntities);

        return {
            symbol,
            conversationEntityCount: conversationPostiveCount + conversationNegativeCount + conversationNeutralCount,
            conversationPostiveCount,
            conversationNegativeCount,
            conversationNeutralCount,
            positiveSentiment,
            negativeSentiment,
            neutralSentiment,
            sentimentScore: _.chain([positiveSentiment, negativeSentiment, neutralSentiment]).sum().divide(3).round(2).value()
        };
    }

    private groupSentimentListByType(entityList: GenericSentimentAnalysisResult[]) {
        return {
            positiveEntities: _.filter(entityList, entity => entity.score >= SentimentConfig.positive),
            negativeEntities: _.filter(entityList, entity => entity.score <= SentimentConfig.negative),
            neutralEntities: _.filter(entityList, entity => entity.score < SentimentConfig.positive && entity.score > SentimentConfig.negative),
        };
    }

    private calculateAverage(entityList: GenericSentimentAnalysisResult[]) {
        if (entityList.length <= 0) {
            return 0;
        }
        return _.chain(entityList)
            .clone()
            .map('score')
            .sum()
            .divide(entityList.length)
            .round(2)
            .value();
    }
};
