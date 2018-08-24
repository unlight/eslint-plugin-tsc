import * as ts from 'typescript';
import { Rule } from 'eslint';
import { createService } from 'typescript-service';

let service: ReturnType<typeof createService>;

export function create(context: Rule.RuleContext) {

    const { compilerOptions, configFile } = context.options[0] || { compilerOptions: {}, configFile: undefined };
    if (!service) {
        service = createService({ compilerOptions, configFile });
    }

    const fileName = context.getFilename();
    const soureText = context.getSourceCode().text;

    const diagnostics = service.getDiagnostics(fileName, soureText);
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
