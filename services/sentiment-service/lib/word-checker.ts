import WordList from 'word-list';
import fs from 'fs';

const configCache: {
    words: string[]
} = {
    words: []
};

export const checker = (input: string) => {
    if (configCache.words.length <= 0) {
        configCache.words = fs.readFileSync(WordList, 'utf8').split('\n');
    }
    return configCache.words.includes(input);
};