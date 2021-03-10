
export const positiveSentimentStatements = [
    '${} is really looking like a great pick for me.',
    'I really like ${}, to the moon',
    '${} TO THE MOON!!!!',
    '${} really has some great potential. The future looks great.'
];

export const negativeSentimentStatements = [
    '${} was the worst pick of the year for me.',
    'I have been losing money like crazy... Thanks ${}.',
    'Who really thought ${} was a good idea? Not me',
    'Terrible terrible stock, ${}.'
];

export const fillerStatements = [
    'To the moon!',
    'I like it',
    'Im new here and do not understand this',
    'what are stocks?'
];

export const getRandomStatement = (type: 'negative' | 'positive' | 'filler', symbol: string) => {
    let maxNumber: number, randomIndex: number;
    switch (type) {
        case 'positive':
            maxNumber = positiveSentimentStatements.length - 1;
            randomIndex = Math.floor(Math.random() * maxNumber);
            return templateSymbol(positiveSentimentStatements[randomIndex], symbol);
        case 'negative':
            maxNumber = negativeSentimentStatements.length - 1;
            randomIndex = Math.floor(Math.random() * maxNumber);
            return templateSymbol(negativeSentimentStatements[randomIndex], symbol);
        case 'filler':
            maxNumber = fillerStatements.length - 1;
            randomIndex = Math.floor(Math.random() * maxNumber);
            return templateSymbol(fillerStatements[randomIndex], symbol);
        default:
            throw Error('Invalid type, how strange');
    }
};

export const templateSymbol = (templateString: string, symbol: string) => {
    if (!templateString || templateString.length <= 0) {
        throw Error('string is empty or undefined, cannot proceed');
    }
    return templateString.replace('${}', symbol);
};
