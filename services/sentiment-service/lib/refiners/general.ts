import { AggregatedRefinedSentimentData, BaseRefiner, BaseRefinerArgs } from './base';

export const config = {
  scoreThreshold: 0.8 //TODO this needs to be figured out through testing
};

export type GeneralRefinerStrategyArgs = BaseRefinerArgs;

export class GeneralRefinerStrategy extends BaseRefiner {
  constructor(args: GeneralRefinerStrategyArgs) {
    super(args);
  }

  refine(): AggregatedRefinedSentimentData[] {
    const groupedEntities = this.groupBySymbol();
    return this.aggregateGroupedBySymbolData(groupedEntities);
    //TODO build out refining when the threshold is figured out
  }
}
