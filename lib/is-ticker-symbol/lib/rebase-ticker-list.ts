import { retrieveNASDAQDataList, retrieveIEXData } from './retrieve-external-data';
import { SymbolsData } from 'api-service';
import { parseString } from '@fast-csv/parse';
import fs from 'fs/promises';
import _ from 'lodash';
import path from 'path';

export interface JsonMarketDataSchema {
    name: string,
    symbol: string
};

export class RebaseTickerList {
    private allMarketCsvDataList: string[];
    private jsonMarketDataList: JsonMarketDataSchema[] = [];
    private symbolDataList: string[] = [];

    constructor() { }

    async rebase() {
        try {
            this.allMarketCsvDataList = await retrieveNASDAQDataList();
            await this.mapToJson();
            await this.gatherAndSetupIEXData();
            this.filterDuplicates();
            this.mapToSymbolList();
            await this.createOrOverwriteDataFiles();
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    private async gatherAndSetupIEXData() {
        try {
            const IEXSymbolsList = await retrieveIEXData();
            const mappedSymbolsList = this.mapIEXToMarketDataSchema(IEXSymbolsList);
            this.jsonMarketDataList = this.jsonMarketDataList.concat(mappedSymbolsList);
        } catch(err) {
            throw err;
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
