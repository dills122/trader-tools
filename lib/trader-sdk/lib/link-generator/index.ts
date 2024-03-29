import watchlist from '../watchlist.config';

export const generator = (linkTemplate: LinkTemplates, symbol: string): string => {
  const upperSymbol = symbol.toUpperCase();
  return linkTemplate.replace('<>', upperSymbol);
};

//Template values
export enum LinkTemplates {
  Finviz = 'https://finviz.com/quote.ashx?t=<>',
  OpenInsider = 'http://openinsider.com/search?q=<>',
  Whalewisdom = 'https://whalewisdom.com/stock/<>',
  Zacks = 'https://www.zacks.com/stock/quote/<>',
  Stocktwits = 'https://stocktwits.com/symbol/<>',
  TradingView = 'https://in.tradingview.com/symbols/<>', //This one requires the exchange too
  AtomFinance = 'https://atom.finance/quote/<>',
  YahooFinance = 'https://finance.yahoo.com/quote/<>',
  SeekingAlpha = 'https://seekingalpha.com/symbol/<>'
}

export const generateLinkList = (): Record<string, unknown>[] => {
  const links: Record<string, unknown>[] = [];
  for (const symbol in watchlist) {
    const { exchange } = watchlist[symbol];
    const entry = {
      symbol: symbol
    };
    for (const linkTemplates of Object.entries(LinkTemplates)) {
      const [key] = linkTemplates;
      if (key === 'TradingView') {
        entry[key] = generator(LinkTemplates[key], `${exchange}-${symbol}`);
      } else {
        entry[key] = generator(LinkTemplates[key], symbol);
      }
    }
    links.push(entry);
  }
  return links;
};
