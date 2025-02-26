import {ImportAts} from "./import-ats";
import {ClassAts} from "./class-ats";

export class FileAts {
    name!: string;
    tsFile!: string;
    jsFile!: string;
    imports: ImportAts[] = [];
    classes: ClassAts[] = [];

    public getImportByName(name: string): ImportAts | undefined  {
        return this.imports.find(i => i.name === name);
    }

    public getImportByPath(path: string): ImportAts | undefined  {
        return this.imports.find(i => i.path === path);
    }

    public getClassByName(name: string): ClassAts | undefined  {
        return this.classes.find(i => i.name === name);
    }
}