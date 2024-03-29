import _ from 'lodash';
import { CandleCollection } from './candles/candles';

export interface BaseIndicatorArgs {
  candles: CandleCollection;
  period?: number;
}

export default class BaseIndicator {
  protected candles: CandleCollection;
  protected period: number;
  constructor(args: BaseIndicatorArgs) {
    _.assign(this, args);
    this.calculatePeriod(this.period);
  }

  setOrUpdateCandles(candles: CandleCollection): void {
    this.candles = candles;
  }

  getCandles(): CandleCollection {
    return this.candles;
  }

  getClosePrices(): number[] {
    return _.map(this.candles, 'close');
  }

  getLowPrices(): number[] {
    return _.map(this.candles, 'low');
  }

  getHighPrices(): number[] {
    return _.map(this.candles, 'high');
  }

  getVolumeAmount(): number[] {
    return _.map(this.candles, 'volume');
  }

  private calculatePeriod(period: number) {
    this.period = period || this.candles.length;
  }
}
