export interface Candle {
    high: number,
    low: number,
    close: number,
    open: number,
    volume: number
};

export type CandleCollection = Array<Candle>;