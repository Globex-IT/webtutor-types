import ts from "typescript";

export interface IAtsParser {
    parse(sourceFiles: ts.SourceFile[]): void;
}