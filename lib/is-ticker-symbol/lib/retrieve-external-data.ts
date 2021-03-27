import jsftp from 'jsftp';
import { IEX, PolygonIO } from 'api-service';
import { config, FileMappingType } from './external-sources.config';
import { filterIexByFilterType, mapNasdaqFilterTypes, mapPolygonFilterTypes } from './util';

export const retrieveIEXData = async (filterType?: string): Promise<IEX.Symbols.SymbolsReferenceData[]> => {
  const symbols = await IEX.Symbols.symbols();
  return filterIexByFilterType(symbols, filterType);
};

export const retrieveNASDAQData = async (market: string): Promise<string> => {
  if (!Object.keys(config.fileMapping).includes(market)) {
    throw Error('Unsupported file given');
  }
  const Ftp = new jsftp({
    host: config.baseServerURI,
    user: 'anonymous',
    pass: undefined
  });
  let csvStr = '';
  return new Promise((resolve, reject) => {
    const fileConfig: FileMappingType = config.fileMapping[market];
    const url = `${config.directory}/${fileConfig.name}.${fileConfig.ext}`;

    Ftp.get(url, (err, socket) => {
      if (err) {
        return reject(err);
      }

      socket.on('data', (d) => {
        csvStr += d.toString();
      });

      socket.on('close', (err) => {
        if (err) {
          console.error('There was an error retrieving the file.');
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      socket.on('end', (_: any) => {
        if (csvStr.length <= 0) {
          return reject(Error('No data found for the given file'));
        }
        Ftp.destroy();
        socket.destroy();
        return resolve(csvStr);
      });
      socket.resume();
    });
  });
};

export const retrieveNASDAQDataList = async (filterType: string): Promise<string[]> => {
  const csvDataList: string[] = [];
  const supportedMarkets = mapNasdaqFilterTypes(filterType);
  for (const market of supportedMarkets) {
    try {
      const csvFileData = await retrieveNASDAQData(market);
      csvDataList.push(csvFileData);
    } catch (err) {
      console.error(err);
      continue;
    }
  }
  if (csvDataList.length <= 0) {
    throw Error('No file data found');
  }
  return csvDataList;
};

export const getPolygonIOData = async (
  filterType?: string
): Promise<PolygonIO.Tickers.TickerSymbolResponse[]> => {
  let count = 0;
  let shouldContinue = true;
  let totalPageCount = 1;
  let tickers: PolygonIO.Tickers.TickerSymbolResponse[] = [];
  do {
    try {
      const tickerPage = await PolygonIO.Tickers.getTickerSymbolPage(count, {
        type: mapPolygonFilterTypes(filterType)
      });
      totalPageCount = Math.ceil(Number(tickerPage.count / tickerPage.perPage) - 2); // I think -1 for 0 indexing, and -1 for skipping the first page in the count
      console.log(`Current Page:${count} out of ${totalPageCount}`);
      count += 1;
      if (count > totalPageCount) {
        shouldContinue = false;
      }
      tickers = tickers.concat(tickerPage.tickers);
    } catch (err) {
      count += 1;
      if (count > totalPageCount) {
        shouldContinue = false;
      }
      console.error(err);
    }
  } while (shouldContinue);
  return tickers;
};

export default {
  retrieveNASDAQData,
  retrieveNASDAQDataList,
  getPolygonIOData,
  retrieveIEXData
};
