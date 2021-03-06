import jsftp from 'jsftp';
import { config, FileMappingType } from './external-sources.config';

export const retrieveData = async (market: string): Promise<string> => {
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
        Ftp.get(`${config.directory}/${fileConfig.name}.${fileConfig.ext}`, (err, socket) => {
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
                return resolve(csvStr);
            });

            socket.resume();
        });
    });
};

export const retrieveDataList = async (): Promise<string[]> => {
    const csvDataList: string[] = [];
    const supportedMarkets = Object.keys(config.fileMapping);
    for (let market of supportedMarkets) {
        try {
            const csvFileData = await retrieveData(market);
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
