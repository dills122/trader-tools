import IEXCloud from './iexcloud.service';

export interface HistoricPricesArgs {
  symbol: string;
  timeframe: Timeframe;
}

export type Timeframe = '1m' | '3m' | '6m' | '1y' | '2y' | '3y' | '1d' | '5d' | '10d';

export const historic = async (args: HistoricPricesArgs): Promise<HistoricPriceCollection> => {
  return await IEXCloud<HistoricPriceCollection>(`/stock/${args.symbol}/chart/${args.timeframe}`);
};

export type HistoricPriceCollection = Array<HistoricPriceQuote>;

export interface HistoricPriceQuote {
  close: number;
  high: number;
  low: number;
  open: number;
  symbol: string;
  volume: number;
  id: string;
  key: string;
  subkey: number;
  date: string;
  updated: number;
  changeOverTime: number;
  marketChangeOverTime: number;
  uOpen: number;
  uClose: number;
  uHigh: number;
  uLow: number;
  uVolume: number;
  fOpen: number;
  fClose: number;
  fHigh: number;
  fLow: number;
  fVolume: number;
  label: number;
  change: number;
  changePercent: number;
}
