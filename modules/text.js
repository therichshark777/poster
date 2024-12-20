const natural = require('natural');
const stopword = require('stopword');

module.exports = {
  processText: (text) => {
    const tokenizer = new natural.WordTokenizer();
    let words = tokenizer.tokenize(text.toLowerCase());
    words = stopword.removeStopwords(words, stopword.ru);
    return words;
  },
};
