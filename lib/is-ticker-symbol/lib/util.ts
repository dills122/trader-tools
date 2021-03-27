import { IEX } from 'api-service';
import _ from 'lodash';
import { config } from './external-sources.config';

export const mapPolygonFilterTypes = (filterType?: string): 'CS' | 'REIT' | 'PUB' | 'MF' | undefined => {
  if (!filterType) {
    return undefined;
  }
  filterType = filterType.toLowerCase();
  if (filterType === 'cs') {
    return 'CS';
  }
  if (filterType === 'mutal') {
    return 'MF';
  }
  return undefined;
};

export const mapNasdaqFilterTypes = (filterType?: string): string[] => {
  if (!filterType) {
    return Object.keys(config.fileMapping);
  }
  filterType = filterType.toLowerCase();
  if (filterType === 'cs') {
    return ['nasdaq'];
  }
  if (filterType === 'mutal') {
    return ['mutalFunds'];
  }
  return Object.keys(config.fileMapping);
};

export const filterIexByFilterType = (
  list: IEX.Symbols.SymbolsReferenceData[],
  filterType?: string
): IEX.Symbols.SymbolsReferenceData[] => {
  if (!filterType || filterType === 'all') {
    return list;
  }
  return _.filter(list, { type: filterType });
};

export default {
  filterIexByFilterType,
  mapPolygonFilterTypes,
  mapNasdaqFilterTypes
};
