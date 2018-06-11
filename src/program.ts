import * as ts from 'typescript';
import fs = require('fs');
import path = require('path');

type CreateProgramOptions = {
    configFile: string;
    projectDirectory?: string;
    compilerOptions?: ts.CompilerOptions;
};

const diagnosticsCompilerOptions: ts.CompilerOptions = {
    noEmit: true,
    sourceMap: false,
    inlineSources: false,
    inlineSourceMap: false,
};

export const getProgram = (() => {
    let program: ts.Program;
    return function getProgram({ configFile, compilerOptions }: CreateProgramOptions) {
        if (!program) {
            program = createProgram({ configFile, compilerOptions });
        }
        return program;
    };
})();

export function createProgram({ configFile, compilerOptions, projectDirectory }: CreateProgramOptions): ts.Program {
    const config = ts.readConfigFile(configFile, ts.sys.readFile);
    if (config.error) {
        throw new Error(ts.formatDiagnostics([config.error], {
            getCanonicalFileName: fn => fn,
            getCurrentDirectory: process.cwd,
            getNewLine: () => '\n',
        }));
    }
    const parseConfigHost: ts.ParseConfigHost = {
        fileExists: fs.existsSync,
        readDirectory: ts.sys.readDirectory,
        readFile: (file) => fs.readFileSync(file, 'utf8'),
        useCaseSensitiveFileNames: true,
    };
    if (!projectDirectory) {
        projectDirectory = path.dirname(configFile);
    }
    if (!compilerOptions) {
        compilerOptions = {};
    }
    const resultCompilerOptions = { ...compilerOptions, ...diagnosticsCompilerOptions };
    const parsed = ts.parseJsonConfigFileContent(config.config, parseConfigHost, path.resolve(projectDirectory), resultCompilerOptions);
    if (parsed.errors) {
        // ignore warnings and 'TS18003: No inputs were found in config file ...'
        const errors = parsed.errors.filter(diagnostic => diagnostic.category === ts.DiagnosticCategory.Error && diagnostic.code !== 18003);
        if (errors.length > 0) {
            throw new Error(ts.formatDiagnostics(errors, {
                getCanonicalFileName: fn => fn,
                getCurrentDirectory: process.cwd,
                getNewLine: () => '\n',
            }));
        }
    }
    const host = ts.createCompilerHost(parsed.options, false);
    const program = ts.createProgram(parsed.fileNames, parsed.options, host);

    return program;
}
