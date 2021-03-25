export interface FileMappingType {
    name: string,
    ext: string
}

export const config = {
    baseServerURI: 'ftp.nasdaqtrader.com',
    directory: 'symboldirectory',
    fileMapping: {
        nasdaq: {
            name: 'nasdaqlisted',
            ext: 'txt'
        },
        other: {
            name: 'otherlisted',
            ext: 'txt'
        },
        mutalFunds: {
            name: 'mfundslist',
            ext: 'txt'
        }
    }
};
