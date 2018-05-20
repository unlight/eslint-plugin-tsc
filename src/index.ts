import * as ts from 'typescript';
import { Rule } from 'eslint';
import { spawnSync } from 'child_process';
import { parse } from './parse';
import { dirname, join } from 'path';
import * as assert from 'assert';

const diagnosticsCompilerOptions: ts.CompilerOptions = {
    sourceMap: false,
    inlineSources: false,
    inlineSourceMap: false,
};

export function create(context: Rule.RuleContext) {

    const { compilerOptions: configCompilerOptions, tsconfigPath } = context.options[0] || { compilerOptions: {}, tsconfigPath: null };
    const compilerOptions: ts.CompilerOptions = { ...configCompilerOptions, ...diagnosticsCompilerOptions };

    const fileName = context.getFilename().replace(/\\/g, '/');

    const tscArgs = ['--noEmit', '--pretty', 'false'];
    assert(tsconfigPath, 'tsconfigPath is empty');
    const projectFilePath = join(dirname(tsconfigPath), fileName).replace(/\\/g, '/');
    tscArgs.unshift(projectFilePath);

    const { stdout, stderr } = spawnSync('node', ['node_modules/typescript/lib/tsc.js', ...tscArgs], { encoding: 'utf8' });
    if (stderr) {
        throw new Error(stderr);
    }

    const fileErrors = parse(stdout, projectFilePath);

    fileErrors.forEach(error => {
        context.report({
            loc: { line: error.line, column: error.column - 1 },
            message: error.errorMessage,
        });
    });

    return {};
}

export const rules = {
    config: {
        create,
        meta: {
            docs: {
                description: 'Wraps a TypeScript compiler checks',
                category: 'TypeScript',
            },
            schema: [
                {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                        compilerOptions: {
                            type: 'object',
                            additionalProperties: true,
                        },
                        tsconfigPath: {
                            type: 'string'
                        },
                    },
                },
            ],
        },
    },
};
