import { rules } from './index';
import { RuleTester } from 'eslint';
import { resolve } from 'path';

const ruleTester = new RuleTester({
    parser: 'typescript-eslint-parser',
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
        ecmaFeatures: {},
    },
});

const root = process.cwd();

ruleTester.run('tests', rules.config as any, {
    invalid: [
        {
            filename: resolve('test-project/errors.ts'),
            code: 'test-project/errors.ts',
            options: [{ configFile: 'test-project/tsconfig.json' }],
            errors: [
                { message: 'Type \'1\' is not assignable to type \'string\'.', line: 2, column: 7 },
                { message: 'Type \'"foo"\' is not assignable to type \'number\'.', line: 3, column: 7 },
            ]
        },
    ],
    valid: [
        {
            filename: resolve('test-project/source.ts'),
            code: 'test-project/source.ts',
            options: [{ configFile: `${root}/test-project/tsconfig.json` }],
        }
    ],
});
