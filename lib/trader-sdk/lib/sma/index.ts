import _ from 'lodash';
import BaseIndicator, { BaseIndicatorArgs, IndicatorLib } from '../base-indicator';
import { SMA as SMA_ti } from 'technicalindicators';
import { SMA as SMA_ts } from 'trading-signals';

const dependencies = {
  SMA: SMA_ti
};

export default class SMA extends BaseIndicator {
  private sma: number;
  constructor(args: BaseIndicatorArgs) {
    super(args);
    this.sma = this.calculate();
  }

  private calculate() {
    switch (this.lib) {
      case IndicatorLib.TechnicalIndicators:
        return this.calculate_TechnicalIndicators();
      case IndicatorLib.TradingSignals:
        return this.calculate_TradingSignals();
      default:
        throw Error('unimplemented technical indicator calc');
    }
  }

  private calculate_TechnicalIndicators() {
    return (
      _.last(
        dependencies.SMA.calculate({
          period: this.period,
          values: this.getClosePrices()
        })
      ) || 0
    );
  }

  private calculate_TradingSignals() {
    const sma = new SMA_ts(this.period);
    for (const close of this.getClosePrices()) {
      sma.update(close);
    }
    return sma.getResult().toNumber();
  }

  getSMAForPeriod(): number {
    return this.sma;
  }
}
