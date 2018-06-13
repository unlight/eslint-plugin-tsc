import * as ts from 'typescript';
import { Rule } from 'eslint';
import { createService } from './service';
import noop = require('1-liners/noop');

let service: ReturnType<typeof createService>;

export function create(context: Rule.RuleContext) {

    const { compilerOptions, configFile } = context.options[0] || { compilerOptions: {}, configFile: undefined };
    if (!service) {
        service = createService({ compilerOptions, configFile });
    }

    const fileName = context.getFilename();
    const fileContent = context.getSourceCode().text;

    service.update({ fileName, fileContent });

    const diagnostics: ReadonlyArray<ts.Diagnostic> = service.getDiagnostics(fileName);
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
