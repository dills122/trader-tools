import IEXCloud from './iexcloud.service';

export interface CryptoSymbolsData {
  symbol: string;
  name: string;
  exchange: string;
  iexId: string;
  currency: string;
  date: string;
  type: string;
  isEnabled: boolean;
  region: string;
}

export const cryptoSymbols = async (): Promise<CryptoSymbolsData[]> => {
  return await IEXCloud<CryptoSymbolsData[]>('/ref-data/crypto/symbols');
};
