import { Candle, isCandleInstance } from "./candles";

export const mapToCandleSchema = (object: Record<string, unknown>) : Candle => {
    if(!isCandleInstance(object)) {
        throw TypeError('Not able to map, missing required fields');
    }
    return {
        close: object.close,
        open: object.open,
        high: object.high,
        low: object.low,
        volume: object.volume
    };
};