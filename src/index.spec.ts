import { rules } from './index';
import { RuleTester } from 'eslint';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const ruleTester = new RuleTester({
    parser: 'typescript-eslint-parser',
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
        ecmaFeatures: {},
    },
});

ruleTester.run('tests', rules.config as any, {
    invalid: [
        {
            filename: resolve('test-project/source.ts'),
            code: readFileSync('test-project/source.ts').toString(),
            options: [{ configFile: 'test-project/tsconfig.json' }],
            errors: [
                { message: 'Type \'1\' is not assignable to type \'string\'.', line: 2, column: 7 },
                { message: 'Type \'"foo"\' is not assignable to type \'number\'.', line: 3, column: 7 },
            ]
        },
    ],
    valid: [
        {
            filename: resolve('test-project/number.ts'),
            code: readFileSync('test-project/number.ts').toString(),
            options: [{ configFile: 'test-project/tsconfig.json' }],
        },
        {
            filename: resolve('test-project/builtin.ts'),
            code: readFileSync('test-project/builtin.ts').toString(),
            options: [{ configFile: 'test-project/tsconfig.json' }],
        },
        {
            filename: resolve('test-project/types.ts'),
            code: readFileSync('test-project/types.ts').toString(),
            options: [{ configFile: 'test-project/tsconfig.json' }],
        },
    ],
});
