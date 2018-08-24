module.exports = {
    'root': true,
    'env': {
        'es6': true,
        'node': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:unicorn/recommended',
    ],
    'parser': 'typescript-eslint-parser',
    'parserOptions': {
        'ecmaVersion': 2017,
        'sourceType': 'module'
    },
    'plugins': [
        'unicorn',
        'typescript',
        'import',
    ],
    'rules': {
        'no-undef': 0,
        'no-unused-vars': 0,
        'indent': 0,
        'unicorn/import-index': 0,
        'import/newline-after-import': 0,
        'import/no-duplicates': 1,
        'import/max-dependencies': [1, { 'max': 10 }],
        'quotes': [1, 'single', { 'allowTemplateLiterals': true }],
        'semi': [1, 'always'],
    }
};
