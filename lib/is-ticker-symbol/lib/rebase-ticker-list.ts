import { getPolygonIOData, retrieveIEXData, retrieveNASDAQDataList } from './retrieve-external-data';
import { PolygonIO, IEX } from 'api-service';
import { parseString } from '@fast-csv/parse';
import fs from 'fs/promises';
import _ from 'lodash';
import path from 'path';

export interface JsonMarketDataSchema {
    name: string,
    symbol: string,
    active: boolean,
    region: string,
    type?: string
};

export interface RebaseTickerListArgs {
    excludedSources?: string[],
    filterType?: 'cs' | 'all' | 'mutal'
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
    private filterType: string;

    constructor(args?: RebaseTickerListArgs) {
        if (args?.excludedSources && args.excludedSources.every(source => validSources.includes(source))) {
            this.excludedSources = args.excludedSources;
        }
        if (args?.filterType) {
            this.filterType = args.filterType;
            console.log(`Has filter type: ${this.filterType}`);
        }
    }

    async rebase() {
        try {
            if (!this.checkIfExcludedSource('nasdaq')) {
                await this.gatherAndSetupNasdaqFTPData();
            }
            if (!this.checkIfExcludedSource('iex')) {
                await this.gatherAndSetupIEXData();
            }
            if (!this.checkIfExcludedSource('polygonio')) {
                await this.gatherAndSetupPolygonIO();
            }
            if (this.jsonMarketDataList.length <= 0) {
                throw Error('No data to proceed, cannot proceed');
            }
            this.filterDuplicates();
            this.filterNonActive();
            this.mapToSymbolList();
            console.log(`Total Tickers Found: ${this.symbolDataList.length}`);
            await this.createOrOverwriteDataFiles();
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    private checkIfExcludedSource(source: string) {
        if (!this.excludedSources) {
            return false;
        }
        return this.excludedSources.includes(source);
    }

    private async gatherAndSetupNasdaqFTPData() {
        try {
            this.allMarketCsvDataList = await retrieveNASDAQDataList(this.filterType);
            await this.mapToJson();
        } catch (err) {
            console.error(err);
        }
    }

    private async gatherAndSetupIEXData() {
        try {
            const IEXSymbolsList = await retrieveIEXData(this.filterType);
            const mappedSymbolsList = this.mapIEXToMarketDataSchema(IEXSymbolsList);
            console.log(`Items Found in IEX: ${mappedSymbolsList.length}`);
            this.jsonMarketDataList = this.jsonMarketDataList.concat(mappedSymbolsList);
        } catch (err) {
            console.error(err);
        }
    }

    private async gatherAndSetupPolygonIO() {
        try {
            const TickersList = await getPolygonIOData(this.filterType);
            const mappedSymbolsList = this.mapPolygonToMarketDataSchema(TickersList);
            console.log(`Items Found in Polygon: ${mappedSymbolsList.length}`);
            this.jsonMarketDataList = this.jsonMarketDataList.concat(mappedSymbolsList);
        } catch (err) {
            console.error(err);
        }
    }

    private mapIEXToMarketDataSchema(IEXSymbolsList: IEX.Symbols.SymbolsReferenceData[]): JsonMarketDataSchema[] {
        return IEXSymbolsList.map((symbolObject) => {
            return {
                name: symbolObject.name,
                symbol: symbolObject.symbol,
                active: symbolObject.isEnabled,
                region: symbolObject.region,
                type: symbolObject.type.toLowerCase()
            };
        });
    }

    private mapPolygonToMarketDataSchema(TickersList: PolygonIO.Tickers.TickerSymbolResponse[]): JsonMarketDataSchema[] {
        return TickersList.map((symbolObject) => {
            return {
                name: symbolObject.name,
                symbol: symbolObject.ticker,
                active: symbolObject.active,
                region: symbolObject.locale,
                type: symbolObject.type.toLowerCase()
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
            console.log(`Items Found in NASDAQ: ${csvDataRows.length}`);
            for (let row of csvDataRows) {
                this.jsonMarketDataList.push({
                    name: row['Security Name'],
                    symbol: row['Symbol'],
                    active: true,
                    region: 'US', //TODO might need to update
                });
            }
        }
    }

    private filterDuplicates() {
        this.jsonMarketDataList = _.uniqBy(this.jsonMarketDataList, 'symbol');
    }

    private filterNonActive() {
        this.jsonMarketDataList = _.filter(this.jsonMarketDataList, json => json.active);
    }

    private mapToSymbolList() {
        this.symbolDataList = this.jsonMarketDataList.map((json) => {
            return json.symbol;
        });
    }
};
