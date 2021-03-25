import _ from 'lodash';
import { TickerNewsItemResponse } from '../../lib/polygon-io/ticker-news.service';

export const TickerNewsItemResponseBase: TickerNewsItemResponse = {
  symbols: [],
  timestamp: '',
  title: '',
  url: '',
  source: '',
  summary: '',
  image: '',
  keywords: []
};

export const getTickerNewsItem = (symbols: string[], title?: string, summary?: string) => {
  const cloned = _.cloneDeep(TickerNewsItemResponseBase);
  cloned.symbols = symbols;
  if (title) {
    cloned.title = title;
  }
  if (summary) {
    cloned.summary = summary;
  }
  return cloned;
};

export const getTickerNewsItemList = (
  symbols: string[],
  size = 5,
  title: string[] = [],
  summary: string[] = []
) => {
  const newItemsList: TickerNewsItemResponse[] = [];
  for (let i = 0; i < size; i++) {
    const newItem = getTickerNewsItem(symbols, title[i], summary[i]);
    newItemsList.push(newItem);
  }
  return newItemsList;
};
