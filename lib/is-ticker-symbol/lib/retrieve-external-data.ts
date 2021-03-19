import jsftp from 'jsftp';
import _ from 'lodash';
import { SymbolsData, PolygonIO } from 'api-service';
import { config, FileMappingType } from './external-sources.config';

export const retrieveIEXData = async (filterType?: string) => {
    try {
        const symbols = await SymbolsData.symbols();
        return filterIexByFilterType(symbols, filterType);
    } catch (err) {
        throw err;
    }
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

            socket.on("data", d => {
                csvStr += d.toString();
            });

            socket.on("close", err => {
                if (err) {
                    console.error("There was an error retrieving the file.");
                }
            });

            socket.on("end", _ => {
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
    for (let market of supportedMarkets) {
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

export const getPolygonIOData = async (filterType?: string) => {
    let count = 0;
    let shouldContinue = true;
    let totalPageCount: number = 1;
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

export const mapPolygonFilterTypes = (filterType?: string) => {
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

export const mapNasdaqFilterTypes = (filterType?: string) => {
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

export const filterIexByFilterType = (list: SymbolsData.SymbolsReferenceData[], filterType?: string) => {
    if (!filterType || filterType === 'all') {
        return list;
    }
    return _.filter(list, { type: filterType });
};

export default {
    retrieveNASDAQData,
    retrieveNASDAQDataList,
    getPolygonIOData,
    retrieveIEXData
};
