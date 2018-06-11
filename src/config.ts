import * as ts from 'typescript';
import { Rule } from 'eslint';
import { createProgram } from './program';
import noop = require('1-liners/noop');
import flatMap = require('1-liners/flatMap');

export function create(context: Rule.RuleContext) {

    const { compilerOptions, configFile } = context.options[0] || { compilerOptions: {}, configFile: null };
    const program: ts.Program = createProgram({ configFile, compilerOptions });

    // TODO: Handle ts.getPreEmitDiagnostics(program) result

    const fileName = context.getFilename();
    const sourceFile = program.getSourceFile(fileName);
    const diagnostics: ReadonlyArray<ts.Diagnostic> = flatMap(item => item, [
        program.getSemanticDiagnostics(sourceFile),
        program.getSyntacticDiagnostics(sourceFile),
        program.getDeclarationDiagnostics(sourceFile),
    ]);

    diagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            context.report({
                loc: { line: line + 1, column: character },
                message: diagnostic.messageText,
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
                properties: {
                    compilerOptions: {
                        type: 'object',
                        additionalProperties: true,
                    },
                    configFile: {
                        type: 'string'
                    },
                },
            },
        ],
    },
};
