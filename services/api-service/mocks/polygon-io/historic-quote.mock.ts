import _ from "lodash";
import { HistoricQuoteResponse } from "../../lib/polygon-io/historic-quote.service";

export const HistoricQuoteResponseBase: HistoricQuoteResponse = {
    status: 'OK',
    from: '',
    symbol: '',
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    volume: 0,
    afterHours: 0,
    preMarket: 0
};

export const getHistoricQuote = (symbol: string, values?: {
    open?: number,
    high?: number,
    close?: number,
    low?: number,
    volume?: number
}) => {
    const cloned = _.cloneDeep(HistoricQuoteResponseBase);
    cloned.symbol = symbol;
    return {
        ...cloned,
        ...values
    };
};
