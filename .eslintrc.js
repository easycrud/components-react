module.exports = {
  'env': {
    'browser': true,
  },
  'rules': {
    'require-jsdoc': 'off',
    'semi': 'error',
    'indent': ['error', 2],
    'max-len': ['error', 120],
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'extends': [
    'react-app',
    'google',
  ],
  'ignorePatterns': ['dist/', 'node_modules/'],
};
