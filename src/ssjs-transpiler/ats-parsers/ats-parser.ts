import ts from "typescript";
import {IAtsParser} from "./interfaces/ats-parser.interface";
import {ImportParser} from "./parsers/import.parser";
import {StaticMembersParse} from "./parsers/staticMembers.parse";

export class AtsParser implements IAtsParser {
    private readonly _importParser = new ImportParser();
    private readonly _staticMembersParse = new StaticMembersParse();

    public parse(sourceFiles: readonly ts.SourceFile[]) {
        this._importParser.parse(sourceFiles);
        this._staticMembersParse.parse(sourceFiles);
    }
}