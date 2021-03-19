import { getPolygonIOData, retrieveIEXData, retrieveNASDAQDataList } from './retrieve-external-data';
import { PolygonIO, SymbolsData } from 'api-service';
import { parseString } from '@fast-csv/parse';
import fs from 'fs/promises';
import _ from 'lodash';
import path from 'path';

export interface JsonMarketDataSchema {
    name: string,
    symbol: string
};

export interface RebaseTickerListArgs {
    excludedSources?: string[]
};

const validSources = [
    'polygonio',
    'iex',
    'nasdaq'
];

export class RebaseTickerList {
    private allMarketCsvDataList: string[];
    private jsonMarketDataList: JsonMarketDataSchema[] = [];
    private symbolDataList: string[] = [];
    private excludedSources: string[];

    constructor(args?: RebaseTickerListArgs) {
        if (args?.excludedSources && args.excludedSources.every(source => validSources.includes(source))) {
            this.excludedSources = args.excludedSources;
        }
    }

    async rebase() {
        try {
            if (!this.excludedSources.includes('nasdaq')) {
                await this.gatherAndSetupNasdaqFTPData();
            }
            if (!this.excludedSources.includes('iex')) {
                await this.gatherAndSetupIEXData();
            }
            if (!this.excludedSources.includes('polygonio')) {
                await this.gatherAndSetupPolygonIO();
            }
            if (this.jsonMarketDataList.length <= 0) {
                throw Error('No data to proceed, cannot proceed');
            }
            this.filterDuplicates();
            this.mapToSymbolList();
            await this.createOrOverwriteDataFiles();
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    private async gatherAndSetupNasdaqFTPData() {
        try {
            this.allMarketCsvDataList = await retrieveNASDAQDataList();
            await this.mapToJson();
        } catch (err) {
            console.error(err);
        }
    }

    private async gatherAndSetupIEXData() {
        try {
            const IEXSymbolsList = await retrieveIEXData();
            const mappedSymbolsList = this.mapIEXToMarketDataSchema(IEXSymbolsList);
            this.jsonMarketDataList = this.jsonMarketDataList.concat(mappedSymbolsList);
        } catch (err) {
            console.error(err);
        }
    }

    private async gatherAndSetupPolygonIO() {
        try {
            const TickersList = await getPolygonIOData();
            const mappedSymbolsList = this.mapPolygonToMarketDataSchema(TickersList);
            this.jsonMarketDataList = this.jsonMarketDataList.concat(mappedSymbolsList);
        } catch (err) {
            console.error(err);
        }
    }

    private mapIEXToMarketDataSchema(IEXSymbolsList: SymbolsData.SymbolsReferenceData[]): JsonMarketDataSchema[] {
        return IEXSymbolsList.map((symbolObject) => {
            return {
                name: symbolObject.name,
                symbol: symbolObject.symbol
            };
        });
    }

    private mapPolygonToMarketDataSchema(TickersList: PolygonIO.Tickers.TickerSymbolResponse[]): JsonMarketDataSchema[] {
        return TickersList.map((symbolObject) => {
            return {
                name: symbolObject.name,
                symbol: symbolObject.ticker
            };
        });
    }

    private async createOrOverwriteDataFiles() {
        try {
            const data = {
                json: this.jsonMarketDataList,
                symbols: this.symbolDataList
            };
            const dataStringified = JSON.stringify(data);
            await fs.writeFile(path.resolve(__dirname, '..', 'config.json'), dataStringified, {
                encoding: 'utf8'
            });
        } catch (err) {
            throw err;
        }
    }

    private parseCsvData(csvString: string): Promise<any[]> {
        const parsedCsvObjs: any[] = [];
        return new Promise((resolve, reject) => {
            parseString(csvString, {
                headers: true,
                delimiter: '|'
            }).on('error', error => {
                console.error(error);
                return reject(error);
            }).on('data', row => {
                parsedCsvObjs.push(row);
            }).on('end', rowCount => {
                console.log(`Parsed ${rowCount} rows`);
                return resolve(parsedCsvObjs);
            });
        });
    }

    private async mapToJson() {
        for (let marketCsvData of this.allMarketCsvDataList) {
            if (!marketCsvData) {
                continue;
            }
            const csvDataRows = await this.parseCsvData(marketCsvData);
            for (let row of csvDataRows) {
                this.jsonMarketDataList.push({
                    name: row['Security Name'],
                    symbol: row['Symbol']
                });
            }
        }
    }

    private filterDuplicates() {
        this.jsonMarketDataList = _.uniqBy(this.jsonMarketDataList, 'symbol');
    }

    private mapToSymbolList() {
        this.symbolDataList = this.jsonMarketDataList.map((json) => {
            return json.symbol;
        });
    }
};
