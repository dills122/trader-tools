import { GenericSentimentAnalysisResult } from '../sharedTypes';
import { SentimentConfig } from '../sentiment.config';
import _ from 'lodash';

export interface AggregatedRefinedSentimentData {
  symbol: string;
  conversationEntityCount: number;
  conversationPostiveCount: number;
  conversationNegativeCount: number;
  conversationNeutralCount: number;
  positiveSentiment: number;
  negativeSentiment: number;
  neutralSentiment: number;
  sentimentScore: number;
}

export interface BaseRefinerArgs {
  sentimentData: GenericSentimentAnalysisResult[];
}

interface GroupedBySymbol {
  [key: string]: GenericSentimentAnalysisResult[];
}

export class BaseRefiner {
  private sentimentData: GenericSentimentAnalysisResult[];
  private aggregatedSentimentData: AggregatedRefinedSentimentData[] = [];

  constructor(args: BaseRefinerArgs) {
    _.assign(this, args);
  }

  refine(): AggregatedRefinedSentimentData[] {
    const grouped = this.groupBySymbol();
    return this.aggregateGroupedBySymbolData(grouped);
  }

  protected groupBySymbol(): GroupedBySymbol {
    const symbolObjectAgg: GroupedBySymbol = {};
    for (const sentimentEntity of this.sentimentData) {
      const symbol = sentimentEntity.symbol;
      // eslint-disable-next-line no-prototype-builtins
      if (symbolObjectAgg.hasOwnProperty(symbol)) {
        symbolObjectAgg[symbol].push(sentimentEntity);
      } else {
        symbolObjectAgg[symbol] = [sentimentEntity];
      }
    }
    return symbolObjectAgg;
  }

  protected aggregateGroupedBySymbolData(groupedEntities: GroupedBySymbol): AggregatedRefinedSentimentData[] {
    const symbols = _.keys(groupedEntities);
    for (const symbol of symbols) {
      const sentimentEntities = groupedEntities[symbol];
      const aggregatedSentimentData = this.calculateAggregatedSentimentData(sentimentEntities, symbol);
      this.aggregatedSentimentData.push(aggregatedSentimentData);
    }
    return this.aggregatedSentimentData;
  }

  private calculateAggregatedSentimentData(
    sentimentEntities: GenericSentimentAnalysisResult[],
    symbol: string
  ): AggregatedRefinedSentimentData {
    const groupedEntitiesBySentimentType = this.groupSentimentListByType(sentimentEntities);
    const conversationPostiveCount = groupedEntitiesBySentimentType.positiveEntities.length;
    const conversationNegativeCount = groupedEntitiesBySentimentType.negativeEntities.length;
    const conversationNeutralCount = groupedEntitiesBySentimentType.neutralEntities.length;
    const positiveSentiment = this.calculateAverage(groupedEntitiesBySentimentType.positiveEntities);
    const negativeSentiment = this.calculateAverage(groupedEntitiesBySentimentType.negativeEntities);
    const neutralSentiment = this.calculateAverage(groupedEntitiesBySentimentType.neutralEntities);
    const totalEntities = conversationPostiveCount + conversationNegativeCount + conversationNeutralCount;

    return {
      symbol,
      conversationEntityCount: totalEntities,
      conversationPostiveCount,
      conversationNegativeCount,
      conversationNeutralCount,
      positiveSentiment,
      negativeSentiment,
      neutralSentiment,
      sentimentScore: this.calculateSentimentScore(
        positiveSentiment,
        negativeSentiment,
        conversationNeutralCount,
        totalEntities
      )
    };
  }

  private groupSentimentListByType(entityList: GenericSentimentAnalysisResult[]) {
    return {
      positiveEntities: _.filter(entityList, (entity) => entity.score >= SentimentConfig.positive),
      negativeEntities: _.filter(entityList, (entity) => entity.score <= SentimentConfig.negative),
      neutralEntities: _.filter(
        entityList,
        (entity) => entity.score < SentimentConfig.positive && entity.score > SentimentConfig.negative
      )
    };
  }

  private calculateAverage(entityList: GenericSentimentAnalysisResult[]) {
    if (entityList.length <= 0) {
      return 0;
    }
    return _.chain(entityList).clone().map('score').sum().divide(entityList.length).round(2).value();
  }

  private calculateSentimentScore(
    positiveSentiment: number,
    negativeSentiment: number,
    neutralEntities: number,
    totalEntities: number
  ) {
    const avgSentiment = _.chain([positiveSentiment, negativeSentiment]).sum().divide(2).round(2).value();
    if (neutralEntities === 0) {
      return avgSentiment;
    }
    const neutralWeightValue = _.chain(neutralEntities)
      .divide(totalEntities)
      .divide(10)
      .multiply(avgSentiment)
      .round(4)
      .value();
    return avgSentiment - neutralWeightValue;
  }
}
