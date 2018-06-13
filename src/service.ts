import * as ts from 'typescript';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

type createServiceOptions = {
    configFile: string;
    compilerOptions?: ts.CompilerOptions;
};

export function createService({ compilerOptions, configFile }: createServiceOptions) {

    const config = ts.readConfigFile(configFile, ts.sys.readFile);
    if (config.error) {
        throw new Error(ts.formatDiagnostics([config.error], {
            getCanonicalFileName: file => file,
            getCurrentDirectory: process.cwd,
            getNewLine: () => '\n',
        }));
    }

    const compilationSettings: ts.CompilerOptions = normalizeCompilerOptions({
        ...((config.config && config.config.compilerOptions) || {}),
        ...(compilerOptions || {}),
        noEmit: true,
        sourceMap: false,
        inlineSources: false,
        inlineSourceMap: false,
    });

    const files: ts.MapLike<{ version: number, snapshot: ts.IScriptSnapshot | undefined }> = {};
    // Adding libs
    (compilationSettings.lib || []).forEach(lib => {
        const fileName = require.resolve(`typescript/lib/lib.${lib}.d.ts`);
        files[fileName] = { version: 0, snapshot: ts.ScriptSnapshot.fromString(readFileSync(fileName, 'utf8')) };
    });

    // Create the language service host to allow the LS to communicate with the host
    const servicesHost: ts.LanguageServiceHost = {
        getScriptFileNames: () => Object.keys(files),
        getScriptVersion: (fileName) => {
            return files[fileName] && String(files[fileName].version);
        },
        getScriptSnapshot: (fileName) => {
            let fileRef = files[fileName];
            if (!fileRef) {
                files[fileName] = fileRef = { version: 0, snapshot: undefined };
            }
            if (fileRef.snapshot === undefined) {
                fileRef.snapshot = ts.ScriptSnapshot.fromString(readFileSync(fileName, 'utf8'));
            }
            return fileRef.snapshot;
        },
        getCurrentDirectory: ts.sys.getCurrentDirectory,
        getCompilationSettings: () => compilationSettings,
        getDefaultLibFileName: (options) => {
            return ts.getDefaultLibFileName(options);
        },
        fileExists: (file) => {
            return ts.sys.fileExists(file);
        },
    };

    // Create the language service files
    const service = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());

    return {
        update({ fileName, fileContent }: { fileName: string, fileContent: string }) {
            let fileRef = files[fileName];
            if (!fileRef) {
                files[fileName] = fileRef = { version: 0, snapshot: undefined };
            }
            fileRef.snapshot = ts.ScriptSnapshot.fromString(fileContent);
            fileRef.version++;
        },
        getDiagnostics(fileName: string) {
            const program = service.getProgram();
            const sourceFile = program.getSourceFile(fileName);
            return [
                ...program.getSyntacticDiagnostics(sourceFile),
                ...program.getSemanticDiagnostics(sourceFile),
            ];
        }
    };
}

function normalizeCompilerOptions(options: ts.CompilerOptions = {}) {
    if (options.target) {
        options.target = toEnum(ts.ScriptTarget, options.target);
    }
    if (options.module) {
        options.module = toEnum(ts.ModuleKind, options.module);
    }
    if (options.moduleResolution) {
        if (String(options.moduleResolution).toLowerCase() === 'node') {
            options.moduleResolution = ts.ModuleResolutionKind.NodeJs;
        }
        options.moduleResolution = toEnum(ts.ModuleResolutionKind, options.moduleResolution);
    }
    return options;
}

function toEnum(collection, value) {
    const valueLower = String(value).toLowerCase();
    const key = Object.keys(collection).find(value => String(value).toLowerCase() === valueLower);
    let result = Number(collection[key]);
    if (Number.isNaN(result)) {
        result = value;
    }
    return result;
}

// function trace(name: string, fn: Function) {
//     return function() {
//         if (name === 'getScriptFileNames') {
//             debugger;
//         }
//         console.log(name, arguments);
//         return fn.apply(this, arguments);
//     };
// }
