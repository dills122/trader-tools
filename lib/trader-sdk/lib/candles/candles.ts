/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import _ from 'lodash';

export interface Candle {
  high: number;
  low: number;
  close: number;
  open: number;
  volume: number;
}

export type CandleCollection = Array<Candle>;

export const isCandleInstance = (object: any): object is Candle => {
  const { high, low, close, open, volume } = object || {};
  return high && low && close && open && volume;
};

export const isCandleCollectionInstance = (collection: any): collection is CandleCollection => {
  if (!_.isArray(collection)) {
    throw TypeError('Is not a collection');
  }
  return collection.some((candle) => {
    return isCandleInstance(candle);
  });
};
