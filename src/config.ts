import * as ts from 'typescript';
import { Rule } from 'eslint';
import { getProgram, createProgram } from './program';
import noop = require('1-liners/noop');

export function create(context: Rule.RuleContext) {

    const fileName = context.getFilename();
    const { compilerOptions, configFile } = context.options[0] || { compilerOptions: {}, configFile: undefined };
    const files = [fileName];
    const program = createProgram({ compilerOptions, configFile, files });

    const sourceFile = program.getSourceFile(fileName);
    const diagnostics: ReadonlyArray<ts.Diagnostic> = [
        ...program.getSemanticDiagnostics(sourceFile),
        ...program.getSyntacticDiagnostics(sourceFile),
    ];

    diagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            context.report({
                message,
                loc: { line: line + 1, column: character },
                messageId: undefined
            });
        }
    });

    return {};
}

export const config = {
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
                required: ['configFile'],
                properties: {
                    configFile: {
                        type: 'string'
                    },
                    compilerOptions: {
                        type: 'object',
                        additionalProperties: true,
                    },
                },
            },
        ],
    },
};
