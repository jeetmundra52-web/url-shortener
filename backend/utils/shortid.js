const { customAlphabet } = require('nanoid');
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 7); // 7-char ids

function generateAlias() {
  return nanoid();
}

module.exports = { generateAlias };
