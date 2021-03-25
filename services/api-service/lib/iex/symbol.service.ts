import IEXCloud from './iexcloud.service';

export interface SymbolsReferenceData {
    symbol: string,
    exchange: string,
    name: string,
    date: string,
    isEnabled: boolean,
    type: string,
    region: string,
    currency: string,
    iexId: string,
    figi: string,
    cik: string
}

export const symbols = async (): Promise<SymbolsReferenceData[]> => {
    return await IEXCloud<SymbolsReferenceData[]>('/ref-data/symbols');
};