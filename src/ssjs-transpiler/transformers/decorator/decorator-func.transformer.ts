import {IBaseTransformer} from "../base/ibase.transformer";
import ts from "typescript";
import {DecoratorFuncCreator} from "./helpers/decorator-func-creator";
import {Project} from "ts-morph";

export class DecoratorFuncTransformer implements IBaseTransformer {
    private readonly _morphProject: Project;
    private _context!: ts.TransformationContext;
    private _decoratorFuncCreator = new DecoratorFuncCreator();

    constructor(morphProject: Project) {
        this._morphProject = morphProject;
    }

    public transform(): ts.TransformerFactory<ts.SourceFile> {
        return (context: ts.TransformationContext) => {
            this._context = context;

            return (node: ts.SourceFile) => this.addProcessingFunDecoration(node);
        };
    }

    private addProcessingFunDecoration(sourceFile: ts.SourceFile): ts.SourceFile {
        const node = sourceFile.forEachChild((node) => this.visitNode(node));
        const newSourceFile = node?.getSourceFile();

        if (!newSourceFile)
            return sourceFile;

        return ts.factory.updateSourceFile(sourceFile, newSourceFile.statements);
    }

    private visitNode(node: ts.Node | undefined): ts.Node | undefined {
        if (!node)
            return;

        if (ts.isClassDeclaration(node)) {
            const decoratorMethod = this._decoratorFuncCreator.create();

            const currentSourceFile = node.getSourceFile();
            return ts.factory.updateSourceFile(currentSourceFile, [...currentSourceFile.statements, decoratorMethod]);
        }

        return node.forEachChild((node: ts.Node) => this.visitNode(node));
    }
}