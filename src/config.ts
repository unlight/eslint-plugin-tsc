import * as ts from 'typescript';
import { Rule } from 'eslint';
import { getProgram } from './program';
import noop = require('1-liners/noop');

export function config(context: Rule.RuleContext) {

    const { compilerOptions, configFile } = context.options[0] || { compilerOptions: {}, configFile: undefined };
    const program: ts.Program = getProgram({ configFile, compilerOptions });

    const fileName = context.getFilename();
    const sourceFile = program.getSourceFile(fileName);
    const diagnostics: ReadonlyArray<ts.Diagnostic> = [
        ...program.getSemanticDiagnostics(sourceFile),
        ...program.getSyntacticDiagnostics(sourceFile),
    ];

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
