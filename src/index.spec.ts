import { rules } from './index';
import { RuleTester } from 'eslint';

const ruleTester = new RuleTester({
    parser: 'typescript-eslint-parser',
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
        ecmaFeatures: {},
    },
});

ruleTester.run('tests', rules.config, {
    invalid: [
        {
            filename: 'source.ts',
            code: `tsconfigPath`,
            options: [{ tsconfigPath: 'test-project/tsconfig.json' }],
            errors: [
                { message: 'Type \'1\' is not assignable to type \'string\'.', line: 1, column: 7 },
                { message: 'Type \'"foo"\' is not assignable to type \'number\'.', line: 2, column: 7 },
            ]
        },
    ],
    valid: [
        {
            filename: 'valid.ts',
            code: `const n: number = 1`,
            options: [{ tsconfigPath: 'test-project/tsconfig.json' }],
        },
    ],
});
