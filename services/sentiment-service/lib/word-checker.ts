import WordList from 'word-list';
import fs from 'fs';

const configCache: {
  words: string[];
} = {
  words: []
};

export const checker = (input: string): boolean => {
  if (configCache.words.length <= 0) {
    configCache.words = fs.readFileSync(WordList, 'utf8').split('\n');
    configCache.words = configCache.words.concat(contractionsList);
  }
  return configCache.words.includes(input);
};

export const contractionsList = ['im', 'id', 'ive', 'ill'];
