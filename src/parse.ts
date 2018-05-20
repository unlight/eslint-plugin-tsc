type TypeScriptError = {
    fileName: string;
    line: number;
    column: number;
    tsError: string
    errorMessage: string;
};

export function parse(stdout: string, matchFile: string) {
    const result: TypeScriptError[] = [];
    stdout
        .replace(/\r/g, '')
        .split('\n')
        .forEach(outline => {
            const matches = outline.match(/^(.+)\((\d+),(\d+)\): (error TS\d+: (.+))$/);
            if (!matches) {
                return;
            }
            const [, fileName, line, column, tsError, errorMessage] = matches;
            if (matchFile !== fileName) {
                return;
            }
            result.push({ fileName, line: +line, column: +column, tsError, errorMessage });
        });
    return result;
}
