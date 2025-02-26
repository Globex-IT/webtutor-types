import {FileAts} from "./file-ats";

export class TypeScriptAst {
    files: FileAts[] = [];

    public getFileByName(name: string): FileAts | undefined  {
        return this.files.find((file: FileAts) => file.name === name);
    }
}