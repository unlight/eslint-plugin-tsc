// eslint-disable-next-line tslint/config
/// <reference path="../node_modules/typescript/lib/lib.es2015.d.ts" />
import { parse } from './parse';
import * as assert from 'assert';

describe('parse', () => {

    it('general', () => {
        const stdout = `source.ts(1,7): error TS2322: Type '1' is not assignable to type 'string'.`;
        const result = parse(stdout, 'source.ts');
        assert.equal(result.length, 1);
        assert.deepEqual(result[0], {
            fileName: 'source.ts',
            line: 1,
            column: 7,
            tsError: `error TS2322: Type '1' is not assignable to type 'string'.`,
            errorMessage: `Type '1' is not assignable to type 'string'.`
        });
    });

    it('unknown output', () => {
        const stdout = `some error from unknown`;
        const result = parse(stdout, 'source.ts');
        assert(result && result.length === 0);
    });

});
